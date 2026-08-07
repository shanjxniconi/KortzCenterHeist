package com.kortz.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ItemProcessResultTest {

  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    objectMapper = new ObjectMapper();
  }

  @Test
  public void testCreate() {
    List<Item> items = Arrays.asList(
      Item.of().name("Item1").volume(2).value(100.0).build(),
      Item.of().name("Item2").volume(3).value(200.0).build()
    );

    ItemProcessResult result = ItemProcessResult.of()
      .selectedItemCount(2)
      .remainingVolume(5)
      .totalValue(300.0)
      .selectedItems(items)
      .build();

    assertEquals(2, result.selectedItemCount());
    assertEquals(5, result.remainingVolume());
    assertEquals(300.0, result.totalValue());
    assertEquals(2, result.selectedItems().size());
    assertEquals("Item1", result.selectedItems().get(0).name());
    assertEquals("Item2", result.selectedItems().get(1).name());
  }

  @Test
  public void testCreateWithNullValues() {
    ItemProcessResult result = ItemProcessResult.of()
      .selectedItemCount(null)
      .remainingVolume(null)
      .totalValue(null)
      .selectedItems(null)
      .build();

    assertNull(result.selectedItemCount());
    assertNull(result.remainingVolume());
    assertNull(result.totalValue());
    assertNull(result.selectedItems());
  }

  @Test
  public void testCreatePartial() {
    ItemProcessResult result = ItemProcessResult.of()
      .selectedItemCount(0)
      .remainingVolume(10)
      .build();

    assertEquals(0, result.selectedItemCount());
    assertEquals(10, result.remainingVolume());
    assertNull(result.totalValue());
    assertNull(result.selectedItems());
  }

  @Test
  public void testCopy() {
    List<Item> items = Arrays.asList(
      Item.of().name("Original").volume(1).value(50.0).build()
    );

    ItemProcessResult original = ItemProcessResult.of()
      .selectedItemCount(1)
      .remainingVolume(9)
      .totalValue(50.0)
      .selectedItems(items)
      .build();

    ItemProcessResult copied = ItemProcessResult.of().copy(original).build();

    assertEquals(original, copied);
    assertEquals(original.hashCode(), copied.hashCode());
  }

  @Test
  public void testCopyWithModification() {
    ItemProcessResult original = ItemProcessResult.of()
      .selectedItemCount(1)
      .remainingVolume(9)
      .build();

    ItemProcessResult modified = ItemProcessResult.of()
      .copy(original)
      .selectedItemCount(2)
      .build();

    assertEquals(2, modified.selectedItemCount());
    assertEquals(9, modified.remainingVolume());
  }

  @Test
  public void testRecordEquality() {
    List<Item> items1 = Arrays.asList(Item.of().name("Item").volume(1).build());
    List<Item> items2 = Arrays.asList(Item.of().name("Item").volume(1).build());
    List<Item> items3 = Arrays.asList(Item.of().name("Different").volume(2).build());

    ItemProcessResult result1 = ItemProcessResult.of()
      .selectedItemCount(1)
      .remainingVolume(9)
      .totalValue(100.0)
      .selectedItems(items1)
      .build();

    ItemProcessResult result2 = ItemProcessResult.of()
      .selectedItemCount(1)
      .remainingVolume(9)
      .totalValue(100.0)
      .selectedItems(items2)
      .build();

    ItemProcessResult result3 = ItemProcessResult.of()
      .selectedItemCount(2)
      .remainingVolume(8)
      .totalValue(100.0)
      .selectedItems(items3)
      .build();

    assertEquals(result1, result2);
    assertNotEquals(result1, result3);
  }

  @Test
  public void testRecordHashCode() {
    List<Item> items1 = Arrays.asList(Item.of().name("Item").volume(1).build());
    List<Item> items2 = Arrays.asList(Item.of().name("Item").volume(1).build());

    ItemProcessResult result1 = ItemProcessResult.of()
      .selectedItemCount(1)
      .remainingVolume(9)
      .totalValue(100.0)
      .selectedItems(items1)
      .build();

    ItemProcessResult result2 = ItemProcessResult.of()
      .selectedItemCount(1)
      .remainingVolume(9)
      .totalValue(100.0)
      .selectedItems(items2)
      .build();

    assertEquals(result1.hashCode(), result2.hashCode());
  }

  @Test
  public void testRecordToString() {
    ItemProcessResult result = ItemProcessResult.of()
      .selectedItemCount(1)
      .remainingVolume(9)
      .build();

    String toString = result.toString();
    assertTrue(toString.contains("ItemProcessResult"));
    assertTrue(toString.contains("selectedItemCount=1"));
    assertTrue(toString.contains("remainingVolume=9"));
  }

  @Test
  public void testJacksonSerialization() throws JsonProcessingException {
    List<Item> items = Arrays.asList(
      Item.of().name("Diamond").volume(1).location("Safe").value(5000.0).isAvailable(true).build(),
      Item.of().name("Gold").volume(2).location("Vault").value(3000.0).isAvailable(true).build()
    );

    ItemProcessResult result = ItemProcessResult.of()
      .selectedItemCount(2)
      .remainingVolume(7)
      .totalValue(8000.0)
      .selectedItems(items)
      .build();

    String json = objectMapper.writeValueAsString(result);

    assertTrue(json.contains("\"selectedItemCount\":2"));
    assertTrue(json.contains("\"remainingVolume\":7"));
    assertTrue(json.contains("\"totalValue\":8000.0"));
    assertTrue(json.contains("\"selectedItems\":"));
    assertTrue(json.contains("\"name\":\"Diamond\""));
    assertTrue(json.contains("\"name\":\"Gold\""));
  }

  @Test
  public void testJacksonSerializationWithNullValues() throws JsonProcessingException {
    ItemProcessResult result = ItemProcessResult.of()
      .selectedItemCount(0)
      .remainingVolume(10)
      .build();

    String json = objectMapper.writeValueAsString(result);

    assertTrue(json.contains("\"selectedItemCount\":0"));
    assertTrue(json.contains("\"remainingVolume\":10"));
    assertFalse(json.contains("\"totalValue\":"));
    assertFalse(json.contains("\"selectedItems\":"));
  }

  @Test
  public void testJacksonDeserialization() throws JsonProcessingException {
    String json = "{\"selectedItemCount\":2,\"remainingVolume\":5,\"totalValue\":300.0,\"selectedItems\":[{\"name\":\"Item1\",\"volume\":2,\"value\":100.0,\"isAvailable\":true},{\"name\":\"Item2\",\"volume\":3,\"value\":200.0,\"isAvailable\":true}]}";

    ItemProcessResult result = objectMapper.readValue(json, ItemProcessResult.class);

    assertEquals(2, result.selectedItemCount());
    assertEquals(5, result.remainingVolume());
    assertEquals(300.0, result.totalValue());
    assertNotNull(result.selectedItems());
    assertEquals(2, result.selectedItems().size());
    assertEquals("Item1", result.selectedItems().get(0).name());
    assertEquals("Item2", result.selectedItems().get(1).name());
  }

  @Test
  public void testJacksonDeserializationWithPartialJson() throws JsonProcessingException {
    String json = "{\"selectedItemCount\":1,\"remainingVolume\":9}";

    ItemProcessResult result = objectMapper.readValue(json, ItemProcessResult.class);

    assertEquals(1, result.selectedItemCount());
    assertEquals(9, result.remainingVolume());
    assertNull(result.totalValue());
    assertNull(result.selectedItems());
  }

}
