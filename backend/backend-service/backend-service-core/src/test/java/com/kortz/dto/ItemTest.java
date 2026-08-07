package com.kortz.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ItemTest {

  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    objectMapper = new ObjectMapper();
  }

  @Test
  public void testCreate() {
    Item item = Item.of()
      .name("TestItem")
      .volume(1)
      .location("Vault")
      .value(1000.0)
      .isAvailable(true)
      .build();

    assertEquals("TestItem", item.name());
    assertEquals(1, item.volume());
    assertEquals("Vault", item.location());
    assertEquals(1000.0, item.value());
    assertTrue(item.isAvailable());
  }

  @Test
  public void testCreateWithNullValues() {
    Item item = Item.of()
      .name(null)
      .volume(null)
      .location(null)
      .value(null)
      .isAvailable(null)
      .build();

    assertNull(item.name());
    assertNull(item.volume());
    assertNull(item.location());
    assertNull(item.value());
    assertNull(item.isAvailable());
  }

  @Test
  public void testCreatePartial() {
    Item item = Item.of()
      .name("Partial Item")
      .volume(1)
      .value(500.0)
      .build();

    assertEquals("Partial Item", item.name());
    assertEquals(1, item.volume());
    assertNull(item.location());
    assertEquals(500.0, item.value());
    assertNull(item.isAvailable());
  }

  @Test
  public void testCopy() {
    Item original = Item.of()
      .name("Original Item")
      .volume(1)
      .location("Warehouse")
      .value(200.0)
      .isAvailable(false)
      .build();

    Item copied = Item.of().copy(original).build();

    assertEquals(original, copied);
    assertEquals(original.hashCode(), copied.hashCode());
  }

  @Test
  public void testCopyWithModification() {
    Item original = Item.of()
      .name("Original")
      .volume(1)
      .build();

    Item modified = Item.of()
      .copy(original)
      .volume(2)
      .build();

    assertEquals("Original", modified.name());
    assertEquals(2, modified.volume());
  }

  @Test
  public void testRecordEquality() {
    Item item1 = Item.of()
      .name("Item")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    Item item2 = Item.of()
      .name("Item")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    Item item3 = Item.of()
      .name("Different")
      .volume(2)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    assertEquals(item1, item2);
    assertNotEquals(item1, item3);
  }

  @Test
  public void testRecordHashCode() {
    Item item1 = Item.of()
      .name("Item")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    Item item2 = Item.of()
      .name("Item")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    assertEquals(item1.hashCode(), item2.hashCode());
  }

  @Test
  public void testRecordToString() {
    Item item = Item.of()
      .name("Test")
      .volume(1)
      .build();

    String toString = item.toString();
    assertTrue(toString.contains("Item"));
    assertTrue(toString.contains("name=Test"));
    assertTrue(toString.contains("volume=1"));
  }

  @Test
  public void testJacksonSerialization() throws JsonProcessingException {
    Item item = Item.of()
      .name("Diamond")
      .volume(1)
      .location("Safe")
      .value(5000.0)
      .isAvailable(true)
      .build();

    String json = objectMapper.writeValueAsString(item);

    assertTrue(json.contains("\"name\":\"Diamond\""));
    assertTrue(json.contains("\"volume\":1"));
    assertTrue(json.contains("\"location\":\"Safe\""));
    assertTrue(json.contains("\"value\":5000.0"));
    assertTrue(json.contains("\"isAvailable\":true"));
  }

  @Test
  public void testJacksonSerializationWithNullValues() throws JsonProcessingException {
    Item item = Item.of()
      .name("Item")
      .build();

    String json = objectMapper.writeValueAsString(item);

    assertTrue(json.contains("\"name\":\"Item\""));
    assertFalse(json.contains("\"volume\":"));
    assertFalse(json.contains("\"location\":"));
    assertFalse(json.contains("\"value\":"));
    assertFalse(json.contains("\"isAvailable\":"));
  }

  @Test
  public void testJacksonDeserialization() throws JsonProcessingException {
    String json = "{\"name\":\"Gold Bar\",\"volume\":1,\"location\":\"Vault\",\"value\":10000.0,\"isAvailable\":true}";

    Item item = objectMapper.readValue(json, Item.class);

    assertEquals("Gold Bar", item.name());
    assertEquals(1, item.volume());
    assertEquals("Vault", item.location());
    assertEquals(10000.0, item.value());
    assertTrue(item.isAvailable());
  }

  @Test
  public void testJacksonDeserializationWithPartialJson() throws JsonProcessingException {
    String json = "{\"name\":\"Partial\",\"volume\":1,\"value\":500.0}";

    Item item = objectMapper.readValue(json, Item.class);

    assertEquals("Partial", item.name());
    assertEquals(1, item.volume());
    assertNull(item.location());
    assertEquals(500.0, item.value());
    assertNull(item.isAvailable());
  }

  @Test
  public void testCreateWithType() {
    Item item = Item.of()
      .name("TestItem")
      .type("scattered")
      .volume(1)
      .location("Vault")
      .value(1000.0)
      .isAvailable(true)
      .build();

    assertEquals("TestItem", item.name());
    assertEquals("scattered", item.type());
    assertEquals(1, item.volume());
    assertEquals("Vault", item.location());
    assertEquals(1000.0, item.value());
    assertTrue(item.isAvailable());
  }

  @Test
  public void testCopyWithType() {
    Item original = Item.of()
      .name("Original Item")
      .type("whole")
      .volume(2)
      .location("Warehouse")
      .value(200.0)
      .isAvailable(false)
      .build();

    Item copied = Item.of().copy(original).build();

    assertEquals(original, copied);
    assertEquals(original.hashCode(), copied.hashCode());
    assertEquals("whole", copied.type());
  }

  @Test
  public void testRecordEqualityWithType() {
    Item item1 = Item.of()
      .name("Item")
      .type("showcase")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    Item item2 = Item.of()
      .name("Item")
      .type("showcase")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    Item item3 = Item.of()
      .name("Item")
      .type("painting")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    assertEquals(item1, item2);
    assertNotEquals(item1, item3);
  }

  @Test
  public void testRecordHashCodeWithType() {
    Item item1 = Item.of()
      .name("Item")
      .type("scattered")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    Item item2 = Item.of()
      .name("Item")
      .type("scattered")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    Item item3 = Item.of()
      .name("Item")
      .type("whole")
      .volume(1)
      .location("Loc")
      .value(100.0)
      .isAvailable(true)
      .build();

    assertEquals(item1.hashCode(), item2.hashCode());
    assertNotEquals(item1.hashCode(), item3.hashCode());
  }

  @Test
  public void testJacksonSerializationWithType() throws JsonProcessingException {
    Item item = Item.of()
      .name("Diamond")
      .type("showcase")
      .volume(3)
      .location("Safe")
      .value(5000.0)
      .isAvailable(true)
      .build();

    String json = objectMapper.writeValueAsString(item);

    assertTrue(json.contains("\"name\":\"Diamond\""));
    assertTrue(json.contains("\"type\":\"showcase\""));
    assertTrue(json.contains("\"volume\":3"));
    assertTrue(json.contains("\"location\":\"Safe\""));
    assertTrue(json.contains("\"value\":5000.0"));
    assertTrue(json.contains("\"isAvailable\":true"));
  }

  @Test
  public void testJacksonDeserializationWithType() throws JsonProcessingException {
    String json = "{\"name\":\"Gold Bar\",\"type\":\"scattered\",\"volume\":1,\"location\":\"Vault\",\"value\":10000.0,\"isAvailable\":true}";

    Item item = objectMapper.readValue(json, Item.class);

    assertEquals("Gold Bar", item.name());
    assertEquals("scattered", item.type());
    assertEquals(1, item.volume());
    assertEquals("Vault", item.location());
    assertEquals(10000.0, item.value());
    assertTrue(item.isAvailable());
  }

}
