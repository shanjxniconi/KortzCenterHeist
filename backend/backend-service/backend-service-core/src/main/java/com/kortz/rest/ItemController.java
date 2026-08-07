package com.kortz.rest;

import com.kortz.dto.ItemProcessResult;
import com.kortz.dto.ItemRequest;
import com.kortz.service.ItemService;
import com.kortz.dto.Item;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ItemController {

  private final ItemService service;

  public ItemController(@Autowired ItemService service) {
    this.service = service;
  }

  @PostMapping(path = "/calcItems", consumes = "application/json", produces = "application/json")
  public ResponseEntity<List<ItemProcessResult>> items(@RequestBody ItemRequest request) {
    List<Item> items = request.multiPlayer() ? 
    request.items() : 
    request.items().stream().filter(item -> !item.location().equals("showroom")).toList();
    return ResponseEntity.status(200).body(service.processItems(items, request.requiredItems()));
  }
}
