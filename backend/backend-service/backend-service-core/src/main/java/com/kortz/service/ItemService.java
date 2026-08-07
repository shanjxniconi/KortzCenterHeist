package com.kortz.service;

import com.kortz.dto.Item;
import com.kortz.dto.ItemProcessResult;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ItemService {

  private Integer maxVolume;
  private static final int DEFAULT_MAX_VOLUME = 10;

  private ItemProcessResult doGreedyAlgorithm(List<Item> items, int currentMaxVolume) {
    List<Item> selectedItems = new ArrayList<>();
    double totalValue = 0.0;
    int remainingVolume = currentMaxVolume;

    boolean itemAdded;
    List<Item> remainingItems = new ArrayList<>(items);

    do {
      itemAdded = false;
      int bestIndex = -1;
      double bestCostPerformance = 0.0;

      for (int i = 0; i < remainingItems.size(); i++) {
        Item item = remainingItems.get(i);
        if (item.volume() <= remainingVolume) {
          double costPerformance = item.value() / item.volume();
          if (costPerformance > bestCostPerformance) {
            bestCostPerformance = costPerformance;
            bestIndex = i;
          }
        }
      }

      if (bestIndex != -1) {
        Item selected = remainingItems.remove(bestIndex);
        selectedItems.add(selected);
        totalValue += selected.value();
        remainingVolume -= selected.volume();
        itemAdded = true;
      }
    } while (itemAdded && remainingVolume > 0);

    System.out.println("greedy selected items count: " + selectedItems.size());
    return ItemProcessResult.of()
      .selectedItemCount(selectedItems.size())
      .remainingVolume(remainingVolume)
      .totalValue(Math.round(totalValue * 100) / 100.0)
      .selectedItems(selectedItems)
      .build();
  }

  private List<ItemProcessResult> findAllCombinationsThatFillBag(List<Item> items, int targetVolume) {
    List<ItemProcessResult> results = new ArrayList<>();
    backtrack(items, 0, new ArrayList<>(), 0, 0, targetVolume, results);
    return results;
  }

  private void backtrack(List<Item> items, int startIndex, List<Item> currentSelection,
                         int currentVolume, double currentValue, int targetVolume,
                         List<ItemProcessResult> results) {
    if (currentVolume == targetVolume) {
      results.add(ItemProcessResult.of()
        .selectedItemCount(currentSelection.size())
        .remainingVolume(0)
        .totalValue(Math.round(currentValue * 100) / 100.0)
        .selectedItems(new ArrayList<>(currentSelection))
        .build());
      return;
    }

    if (currentVolume > targetVolume) {
      return;
    }

    for (int i = startIndex; i < items.size(); i++) {
      Item item = items.get(i);
      currentSelection.add(item);
      backtrack(items, i + 1, currentSelection,
        currentVolume + item.volume(), currentValue + item.value(),
        targetVolume, results);
      currentSelection.remove(currentSelection.size() - 1);
    }
  }

  private ItemProcessResult doDynamicAlgorithm(List<Item> availableItems, int currentMaxVolume,
                                                List<Item> preSelectedItems, double preTotalValue) {
    List<ItemProcessResult> allCombinations = findAllCombinationsThatFillBag(availableItems, currentMaxVolume);

    if (!preSelectedItems.isEmpty()) {
      List<ItemProcessResult> adjustedCombinations = new ArrayList<>();
      for (ItemProcessResult combo : allCombinations) {
        List<Item> combinedSelectedItems = new ArrayList<>(preSelectedItems);
        combinedSelectedItems.addAll(combo.selectedItems());
        adjustedCombinations.add(ItemProcessResult.of()
          .selectedItemCount(combinedSelectedItems.size())
          .remainingVolume(combo.remainingVolume())
          .totalValue(Math.round((preTotalValue + combo.totalValue()) * 100) / 100.0)
          .selectedItems(combinedSelectedItems)
          .build());
      }
      allCombinations = adjustedCombinations;
    }

    if (allCombinations.isEmpty()) {
      return null;
    }

    return allCombinations.stream()
      .max((a, b) -> {
        int valueCompare = Double.compare(a.totalValue(), b.totalValue());
        if (valueCompare != 0) {
          return valueCompare;
        }
        return -Integer.compare(a.selectedItemCount(), b.selectedItemCount());
      })
      .orElse(null);
  }

  public List<ItemProcessResult> processItems(List<Item> items, List<Item> requiredItems) {
    List<ItemProcessResult> results = new ArrayList<>();

    int currentMaxVolume = DEFAULT_MAX_VOLUME;
    List<Item> preSelectedItems = new ArrayList<>();
    double preTotalValue = 0.0;

    if (requiredItems != null && !requiredItems.isEmpty()) {
      boolean allNonShowroom = requiredItems.stream()
        .allMatch(item -> item.location() == null || !"showroom".equals(item.location()));

      if (allNonShowroom) {
        for (Item item : requiredItems) {
          if (item.volume() != null && item.value() != null && item.volume() > 0 && item.value() > 0 && item.volume() <= currentMaxVolume) {
            preSelectedItems.add(item);
            preTotalValue += item.value();
            currentMaxVolume -= item.volume();
          }
        }
        preTotalValue += 20;
      }
    }

    List<String> preSelectedItemNames = preSelectedItems.stream()
      .map(Item::name)
      .collect(Collectors.toList());

    List<Item> availableItems = items.stream()
      .filter(Item::isAvailable)
      .filter(item -> item.volume() != null && item.value() != null && item.volume() > 0 && item.value() > 0)
      .filter(item -> !preSelectedItemNames.contains(item.name()))
      .sorted((a, b) -> {
        BigDecimal aCostPerformance = BigDecimal.valueOf(a.value() / a.volume());
        BigDecimal bCostPerformance = BigDecimal.valueOf(b.value() / b.volume());
        return bCostPerformance.compareTo(aCostPerformance);
      })
      .collect(Collectors.toList());

    ItemProcessResult dynamicResult = doDynamicAlgorithm(availableItems, currentMaxVolume, preSelectedItems, preTotalValue);

    if (dynamicResult != null) {
      results.add(dynamicResult);
    } else {
      ItemProcessResult greedyResult = doGreedyAlgorithm(availableItems, currentMaxVolume);

      if (!preSelectedItems.isEmpty()) {
        List<Item> combinedSelectedItems = new ArrayList<>(preSelectedItems);
        combinedSelectedItems.addAll(greedyResult.selectedItems());
        greedyResult = ItemProcessResult.of()
          .selectedItemCount(combinedSelectedItems.size())
          .remainingVolume(greedyResult.remainingVolume())
          .totalValue(Math.round((preTotalValue + greedyResult.totalValue()) * 100) / 100.0)
          .selectedItems(combinedSelectedItems)
          .build();
      }

      results.add(greedyResult);
    }

    results.sort((a, b) -> b.totalValue().compareTo(a.totalValue()));
    return results;
  }
}
