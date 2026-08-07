package com.kortz.service;

import com.kortz.dto.Item;
import com.kortz.dto.ItemProcessResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ItemServiceTest {

  private ItemService itemService;

  @BeforeEach
  void setUp() {
    itemService = new ItemService();
  }

  @Test
  void testSelectedItemsRetainTypeField() {
    List<Item> items = Arrays.asList(
      Item.of().name("Item1").type("scattered").volume(1).value(100.0).isAvailable(true).build(),
      Item.of().name("Item2").type("whole").volume(2).value(200.0).isAvailable(true).build(),
      Item.of().name("Item3").type("showcase").volume(3).value(150.0).isAvailable(true).build()
    );

    List<ItemProcessResult> results = itemService.processItems(items, Collections.emptyList());

    assertFalse(results.isEmpty());
    ItemProcessResult result = results.get(0);
    assertNotNull(result.selectedItems());
    assertFalse(result.selectedItems().isEmpty());

    for (Item item : result.selectedItems()) {
      assertNotNull(item.type());
    }
  }

  @Test
  void testSelectedItemsTypeValuesMatchInput() {
    List<Item> items = Arrays.asList(
      Item.of().name("Item1").type("scattered").volume(1).value(100.0).isAvailable(true).build(),
      Item.of().name("Item2").type("whole").volume(2).value(200.0).isAvailable(true).build(),
      Item.of().name("Item3").type("showcase").volume(5).value(50.0).isAvailable(true).build()
    );

    List<ItemProcessResult> results = itemService.processItems(items, Collections.emptyList());

    assertFalse(results.isEmpty());
    ItemProcessResult result = results.get(0);

    for (Item selected : result.selectedItems()) {
      Item original = items.stream()
        .filter(i -> i.name().equals(selected.name()))
        .findFirst()
        .orElse(null);
      assertNotNull(original);
      assertEquals(original.type(), selected.type());
    }
  }

  @Test
  void testSelectedItemsRetainTypeFieldWithRequiredItems() {
    List<Item> items = Arrays.asList(
      Item.of().name("Regular1").type("scattered").volume(1).value(100.0).isAvailable(true).build(),
      Item.of().name("Regular2").type("whole").volume(2).value(200.0).isAvailable(true).build()
    );

    List<Item> requiredItems = Arrays.asList(
      Item.of().name("Required1").type("showcase").volume(2).value(150.0).isAvailable(true).build()
    );

    List<ItemProcessResult> results = itemService.processItems(items, requiredItems);

    assertFalse(results.isEmpty());
    ItemProcessResult result = results.get(0);
    assertNotNull(result.selectedItems());
    assertFalse(result.selectedItems().isEmpty());

    for (Item item : result.selectedItems()) {
      assertNotNull(item.type());
    }
  }

  @Test
  void testZeroValueItemsAreFilteredFromAvailableItems() {
    List<Item> items = Arrays.asList(
      Item.of().name("Valuable").volume(1).value(100.0).isAvailable(true).build(),
      Item.of().name("ZeroValue").volume(1).value(0.0).isAvailable(true).build(),
      Item.of().name("AnotherValuable").volume(1).value(200.0).isAvailable(true).build()
    );

    List<ItemProcessResult> results = itemService.processItems(items, Collections.emptyList());

    assertFalse(results.isEmpty());
    ItemProcessResult result = results.get(0);

    for (Item item : result.selectedItems()) {
      assertTrue(item.value() > 0, "Zero value item should be filtered out: " + item.name());
    }
  }

  @Test
  void testZeroValueRequiredItemsAreFiltered() {
    List<Item> items = Arrays.asList(
      Item.of().name("Regular").volume(1).value(100.0).isAvailable(true).build()
    );

    List<Item> requiredItems = Arrays.asList(
      Item.of().name("ZeroValueRequired").volume(1).value(0.0).isAvailable(true).build()
    );

    List<ItemProcessResult> results = itemService.processItems(items, requiredItems);

    assertFalse(results.isEmpty());
    ItemProcessResult result = results.get(0);

    for (Item item : result.selectedItems()) {
      assertTrue(item.value() > 0, "Zero value required item should be filtered out: " + item.name());
    }
  }

  @Test
  void testZeroValueItemsNotSelectedByGreedyAlgorithm() {
    List<Item> items = Arrays.asList(
      Item.of().name("ZeroVal1").volume(5).value(0.0).isAvailable(true).build(),
      Item.of().name("ZeroVal2").volume(5).value(0.0).isAvailable(true).build(),
      Item.of().name("Valuable").volume(10).value(100.0).isAvailable(true).build()
    );

    List<ItemProcessResult> results = itemService.processItems(items, Collections.emptyList());

    assertFalse(results.isEmpty());
    ItemProcessResult result = results.get(0);

    assertEquals(1, result.selectedItemCount());
    assertEquals("Valuable", result.selectedItems().get(0).name());
  }

  @Test
  void testZeroValueItemsNotSelectedByDynamicAlgorithm() {
    List<Item> items = Arrays.asList(
      Item.of().name("Item1").volume(2).value(0.0).isAvailable(true).build(),
      Item.of().name("Item2").volume(3).value(0.0).isAvailable(true).build(),
      Item.of().name("Item3").volume(5).value(100.0).isAvailable(true).build(),
      Item.of().name("Item4").volume(5).value(80.0).isAvailable(true).build()
    );

    List<ItemProcessResult> results = itemService.processItems(items, Collections.emptyList());

    assertFalse(results.isEmpty());
    ItemProcessResult result = results.get(0);

    assertEquals(2, result.selectedItemCount());
    assertEquals(180.0, result.totalValue());

    for (Item item : result.selectedItems()) {
      assertTrue(item.value() > 0, "Zero value item should be filtered out: " + item.name());
    }
  }
}
