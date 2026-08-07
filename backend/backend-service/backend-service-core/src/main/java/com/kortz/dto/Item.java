package com.kortz.dto;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"name", "type", "volume", "location", "value", "isAvailable"})
@JsonInclude(NON_EMPTY)
public record Item (
  @JsonProperty("name") String name,
  @JsonProperty("type") String type,
  @JsonProperty("volume") Integer volume,
  @JsonProperty("location") String location,
  @JsonProperty("value") Double value,
  @JsonProperty("isAvailable") Boolean isAvailable
) {

  public static Builder of() {
    return new Builder();
  }

  public static class Builder {



    private String name;
    private String type;
    private Integer volume;
    private String location;
    private Double value;
    private Boolean isAvailable;

    public Item build() {
      return new Item(name, type, volume, location, value, isAvailable);
    }

    public Builder copy(Item ori) {
      return name(ori.name)
        .type(ori.type)
        .volume(ori.volume)
        .location(ori.location)
        .value(ori.value)
        .isAvailable(ori.isAvailable);
    }

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Builder type(String type) {
      this.type = type;
      return this;
    }

    public Builder volume(Integer volume) {
      this.volume = volume;
      return this;
    }

    public Builder location(String location) {
      this.location = location;
      return this;
    }

    public Builder value(Double value) {
      this.value = value;
      return this;
    }

    public Builder isAvailable(Boolean isAvailable) {
      this.isAvailable = isAvailable;
      return this;
    }

  }

}
