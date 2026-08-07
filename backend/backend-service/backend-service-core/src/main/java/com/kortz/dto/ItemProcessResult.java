package com.kortz.dto;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.List;

@JsonPropertyOrder({"selectedItemCount", "remainingVolume", "totalValue", "selectedItems"})
@JsonInclude(NON_EMPTY)
public record ItemProcessResult(
  @JsonProperty("selectedItemCount") Integer selectedItemCount,
  @JsonProperty("remainingVolume") Integer remainingVolume,
  @JsonProperty("totalValue") Double totalValue,
  @JsonProperty("selectedItems") List<Item> selectedItems
) {

  public static Builder of() {
    return new Builder();
  }

  public static class Builder {

    private Integer selectedItemCount;
    private Integer remainingVolume;
    private Double totalValue;
    private List<Item> selectedItems;

    public ItemProcessResult build() {
      return new ItemProcessResult(selectedItemCount, remainingVolume, totalValue, selectedItems);
    }

    public Builder copy(ItemProcessResult ori) {
      return selectedItemCount(ori.selectedItemCount)
        .remainingVolume(ori.remainingVolume)
        .totalValue(ori.totalValue)
        .selectedItems(ori.selectedItems);
    }

    public Builder selectedItemCount(Integer selectedItemCount) {
      this.selectedItemCount = selectedItemCount;
      return this;
    }

    public Builder remainingVolume(Integer remainingVolume) {
      this.remainingVolume = remainingVolume;
      return this;
    }

    public Builder totalValue(Double totalValue) {
      this.totalValue = totalValue;
      return this;
    }

    public Builder selectedItems(List<Item> selectedItems) {
      this.selectedItems = selectedItems;
      return this;
    }

  }

}
