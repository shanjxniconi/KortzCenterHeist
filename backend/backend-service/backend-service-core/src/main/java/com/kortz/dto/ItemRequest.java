package com.kortz.dto;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.List;

@JsonPropertyOrder({"multiPlayer", "playerCount", "items", "requiredItems"})
@JsonInclude(NON_EMPTY)
public record ItemRequest(
  @JsonProperty("multiPlayer") boolean multiPlayer,
  @JsonProperty("playerCount") int playerCount,
  @JsonProperty("items") List<Item> items,
  @JsonProperty("requiredItems") List<Item> requiredItems
) {

  public static Builder of() {
    return new Builder();
  }

  public static class Builder {

    private boolean multiPlayer;
    private int playerCount;  
    private List<Item> items;
    private List<Item> requiredItems;

    public ItemRequest build() {
      return new ItemRequest(multiPlayer, playerCount, items, requiredItems);
    }

    public Builder copy(ItemRequest ori) {
      return multiPlayer(ori.multiPlayer)
        .playerCount(ori.playerCount)
        .items(ori.items)
        .requiredItems(ori.requiredItems);
    }

    public Builder multiPlayer(boolean multiPlayer) {
      this.multiPlayer = multiPlayer;
      return this;
    }

    public Builder playerCount(int playerCount) {
      this.playerCount = playerCount;
      return this;
    }

    public Builder items(List<Item> items) {
      this.items = items;
      return this;
    }

    public Builder requiredItems(List<Item> requiredItems) {
      this.requiredItems = requiredItems;
      return this;
    }

  }

}
