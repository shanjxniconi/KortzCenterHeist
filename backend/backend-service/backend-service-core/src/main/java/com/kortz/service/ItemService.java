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
  private static final int MAX_PLAYERS = 4;

  // DP entry for single knapsack: stores best solution at a given volume
  private static class DPEntry {
    double value;
    int itemCount;
    List<Item> selection;

    DPEntry(double value, int itemCount, List<Item> selection) {
      this.value = value;
      this.itemCount = itemCount;
      this.selection = selection;
    }
  }

  // DP entry for multi knapsack: stores best solution at a given capacity tuple
  private static class MultiDPEntry {
    double value;
    List<List<Item>> selections; // per knapsack

    MultiDPEntry(double value, List<List<Item>> selections) {
      this.value = value;
      this.selections = selections;
    }
  }

  // Single-player 0/1 knapsack DP.
  // Priority 1: max value
  // Priority 2: max usedVolume (尽量装满)
  // Priority 3: when bag is full, min itemCount
  private ItemProcessResult doSingleDP(
    List<Item> availableItems,
    int maxVolume,
    List<Item> preSelectedItems,
    double preTotalValue
  ) {
    if (availableItems.isEmpty() && preSelectedItems.isEmpty()) {
      return null;
    }

    // dp[v] = best solution using exactly v volume (null = unreachable)
    DPEntry[] dp = new DPEntry[maxVolume + 1];
    dp[0] = new DPEntry(0.0, 0, new ArrayList<>());

    for (Item item : availableItems) {
      int vol = item.volume();
      double val = item.value();
      // Reverse traversal: 0/1 knapsack trick (each item used at most once)
      for (int v = maxVolume; v >= vol; v--) {
        if (dp[v - vol] == null) continue;

        double newVal = dp[v - vol].value + val;
        int newCount = dp[v - vol].itemCount + 1;
        List<Item> newSelection = new ArrayList<>(dp[v - vol].selection);
        newSelection.add(item);

        if (dp[v] == null) {
          dp[v] = new DPEntry(newVal, newCount, newSelection);
        } else if (newVal > dp[v].value + 1e-9) {
          // Priority 1: higher value
          dp[v] = new DPEntry(newVal, newCount, newSelection);
        } else if (Math.abs(newVal - dp[v].value) < 1e-9) {
          // Priority 3: same value + bag full → fewer items
          if (v == maxVolume && newCount < dp[v].itemCount) {
            dp[v] = new DPEntry(newVal, newCount, newSelection);
          }
        }
      }
    }

    // Scan all volumes: priority 1 (max value) → priority 2 (max volume)
    double bestValue = -1.0;
    int bestVolume = -1;
    DPEntry bestEntry = null;

    for (int v = 0; v <= maxVolume; v++) {
      if (dp[v] == null) continue;
      if (dp[v].value > bestValue + 1e-9) {
        bestValue = dp[v].value;
        bestVolume = v;
        bestEntry = dp[v];
      } else if (Math.abs(dp[v].value - bestValue) < 1e-9 && v > bestVolume) {
        bestVolume = v;
        bestEntry = dp[v];
      }
    }

    if (bestEntry == null) {
      bestEntry = new DPEntry(0.0, 0, new ArrayList<>());
      bestVolume = 0;
    }

    List<Item> finalSelection = new ArrayList<>(preSelectedItems);
    finalSelection.addAll(bestEntry.selection);
    double finalTotalValue = preTotalValue + bestEntry.value;
    int finalRemaining = maxVolume - bestVolume;

    System.out.println("single-DP total value: " + (Math.round(finalTotalValue * 100) / 100.0) +
      ", used: " + bestVolume + "/" + maxVolume +
      ", items: " + finalSelection.size());

    return ItemProcessResult.of()
      .selectedItemCount(finalSelection.size())
      .remainingVolume(finalRemaining)
      .totalValue(Math.round(finalTotalValue * 100) / 100.0)
      .selectedItems(finalSelection)
      .build();
  }

  // Multi-player multi-knapsack DP using multi-dimensional state.
  // State: dp[v1][v2]...[vK] = max total value when knapsack k uses exactly vk volume.
  // Total states: (C1+1) * (C2+1) * ... * (CK+1), e.g. 11^4 = 14641 for 4 full knapsacks.
  // Each item: skip, or place in knapsack k (if fits). O(N * states * K).
  private List<ItemProcessResult> doMultiDP(
    List<Item> availableItems,
    int knapsackCount,
    List<List<Item>> preSelectedPerKnapsack,
    double preBonus,
    int[] preRemainingVolumes
  ) {
    int[] caps = preRemainingVolumes.clone();
    int[] dims = new int[knapsackCount];
    int totalStates = 1;
    for (int k = 0; k < knapsackCount; k++) {
      dims[k] = caps[k] + 1;
      totalStates *= dims[k];
    }

    MultiDPEntry[] dp = new MultiDPEntry[totalStates];

    // Initial state: all zeros
    List<List<Item>> initSelections = new ArrayList<>();
    for (int k = 0; k < knapsackCount; k++) {
      initSelections.add(new ArrayList<>());
    }
    dp[0] = new MultiDPEntry(0.0, initSelections);

    for (Item item : availableItems) {
      int vol = item.volume();
      double val = item.value();

      // Reverse traversal: 0/1 knapsack (each item used at most once across all knapsacks)
      for (int idx = totalStates - 1; idx >= 0; idx--) {
        if (dp[idx] == null) continue;

        int[] vs = decodeIndex(idx, dims);

        // Try placing item in each knapsack
        for (int k = 0; k < knapsackCount; k++) {
          if (vs[k] + vol <= caps[k]) {
            int[] newVs = vs.clone();
            newVs[k] += vol;
            int newIdx = encodeIndex(newVs, dims);

            double newVal = dp[idx].value + val;

            if (dp[newIdx] == null || newVal > dp[newIdx].value + 1e-9) {
              // Copy selections; only deep-copy the modified knapsack's list
              List<List<Item>> newSelections = new ArrayList<>();
              for (int j = 0; j < knapsackCount; j++) {
                if (j == k) {
                  List<Item> newSel = new ArrayList<>(dp[idx].selections.get(j));
                  newSel.add(item);
                  newSelections.add(newSel);
                } else {
                  newSelections.add(dp[idx].selections.get(j));
                }
              }
              dp[newIdx] = new MultiDPEntry(newVal, newSelections);
            }
          }
        }
      }
    }

    // Find best state (max total value across all knapsacks)
    double bestValue = -1.0;
    int bestIdx = -1;
    for (int idx = 0; idx < totalStates; idx++) {
      if (dp[idx] == null) continue;
      if (dp[idx].value > bestValue + 1e-9) {
        bestValue = dp[idx].value;
        bestIdx = idx;
      }
    }

    // Build per-player results
    int[] bestVs = (bestIdx >= 0) ? decodeIndex(bestIdx, dims) : new int[knapsackCount];
    MultiDPEntry best = (bestIdx >= 0) ? dp[bestIdx] : dp[0];

    List<ItemProcessResult> results = new ArrayList<>();
    for (int k = 0; k < knapsackCount; k++) {
      List<Item> playerItems = new ArrayList<>(preSelectedPerKnapsack.get(k));
      playerItems.addAll(best.selections.get(k));

      double playerValueSum = playerItems.stream().mapToDouble(Item::value).sum();
      double playerValue = Math.round(playerValueSum * 100) / 100.0;
      if (k == 0) {
        playerValue += preBonus;
        playerValue = Math.round(playerValue * 100) / 100.0;
      }

      int playerRemaining = caps[k] - bestVs[k];

      results.add(ItemProcessResult.of()
        .selectedItemCount(playerItems.size())
        .remainingVolume(playerRemaining)
        .totalValue(Math.round(playerValue * 100) / 100.0)
        .selectedItems(playerItems)
        .build());
    }

    double multiDpTotal = results.stream().mapToDouble(ItemProcessResult::totalValue).sum();
    System.out.println("multi-DP players: " + knapsackCount +
      ", best total value: " + (Math.round(multiDpTotal * 100) / 100.0));

    return results;
  }

  // Encode multi-dimensional index to flat array index
  private int encodeIndex(int[] vs, int[] dims) {
    int idx = 0;
    int stride = 1;
    for (int k = 0; k < vs.length; k++) {
      idx += vs[k] * stride;
      stride *= dims[k];
    }
    return idx;
  }

  // Decode flat array index to multi-dimensional index
  private int[] decodeIndex(int idx, int[] dims) {
    int[] vs = new int[dims.length];
    for (int k = 0; k < dims.length; k++) {
      vs[k] = idx % dims[k];
      idx /= dims[k];
    }
    return vs;
  }

  public List<ItemProcessResult> processItems(List<Item> items, List<Item> requiredItems) {
    return processItems(items, requiredItems, 1, false);
  }

  public List<ItemProcessResult> processItems(
    List<Item> items,
    List<Item> requiredItems,
    int playerCount,
    boolean multiPlayer
  ) {
    int effectivePlayerCount = multiPlayer
      ? Math.max(1, Math.min(playerCount, MAX_PLAYERS))
      : 1;

    List<ItemProcessResult> results;
    if (effectivePlayerCount == 1) {
      results = processItemsSinglePlayer(items, requiredItems);
    } else {
      results = processItemsMultiPlayer(items, requiredItems, effectivePlayerCount);
    }

    double grandTotal = results.stream()
      .mapToDouble(r -> r.totalValue() != null ? r.totalValue() : 0.0)
      .sum();
    double roundedGrandTotal = Math.round(grandTotal * 100) / 100.0;

    return results.stream()
      .map(r -> ItemProcessResult.of().copy(r).totalValueAllPlayers(roundedGrandTotal).build())
      .collect(Collectors.toList());
  }

  private List<ItemProcessResult> processItemsMultiPlayer(
    List<Item> items,
    List<Item> requiredItems,
    int knapsackCount
  ) {
    // Multi-player logic (2-4 players)
    int[] remainingVolumes = new int[knapsackCount];
    Arrays.fill(remainingVolumes, DEFAULT_MAX_VOLUME);

    // Track pre-selected (required) items per knapsack
    List<List<Item>> preSelectedPerKnapsack = new ArrayList<>();
    for (int k = 0; k < knapsackCount; k++) {
      preSelectedPerKnapsack.add(new ArrayList<>());
    }

    double preBonus = 0.0;

    if (requiredItems != null && !requiredItems.isEmpty()) {
      // Multi-player mode: do NOT check showroom location (controller already handled filtering)
      boolean allFit = true;
      int[] tempVolumes = remainingVolumes.clone();

      for (Item item : requiredItems) {
        if (item.volume() != null && item.value() != null && item.volume() > 0 && item.value() > 0) {
          // Find first knapsack that fits
          int placedIdx = -1;
          for (int k = 0; k < tempVolumes.length; k++) {
            if (tempVolumes[k] >= item.volume()) {
              tempVolumes[k] -= item.volume();
              placedIdx = k;
              break;
            }
          }
          if (placedIdx == -1) {
            allFit = false;
            continue;
          }
          preSelectedPerKnapsack.get(placedIdx).add(item);
        }
      }

      remainingVolumes = tempVolumes;
      boolean anyPreSelected = preSelectedPerKnapsack.stream().anyMatch(lst -> !lst.isEmpty());
      if (allFit && anyPreSelected) {
        preBonus = 20.0;
      }
    }

    // Collect all pre-selected item names to exclude from available items
    List<String> preSelectedItemNames = preSelectedPerKnapsack.stream()
      .flatMap(List::stream)
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

    List<ItemProcessResult> results = doMultiDP(
      availableItems, knapsackCount, preSelectedPerKnapsack, preBonus, remainingVolumes
    );

    results.sort((a, b) -> b.totalValue().compareTo(a.totalValue()));
    return results;
  }

  // Single-player logic using DP
  private List<ItemProcessResult> processItemsSinglePlayer(List<Item> items, List<Item> requiredItems) {
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
            preTotalValue = Math.round(preTotalValue * 100) / 100.0;
            currentMaxVolume -= item.volume();
          }
        }
        preTotalValue += 20;
        preTotalValue = Math.round(preTotalValue * 100) / 100.0;
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

    ItemProcessResult dpResult = doSingleDP(availableItems, currentMaxVolume, preSelectedItems, preTotalValue);

    if (dpResult != null) {
      results.add(dpResult);
    } else {
      ItemProcessResult emptyResult = ItemProcessResult.of()
        .selectedItemCount(preSelectedItems.size())
        .remainingVolume(currentMaxVolume)
        .totalValue(Math.round(preTotalValue * 100) / 100.0)
        .selectedItems(new ArrayList<>(preSelectedItems))
        .build();
      results.add(emptyResult);
    }

    results.sort((a, b) -> b.totalValue().compareTo(a.totalValue()));
    return results;
  }
}
