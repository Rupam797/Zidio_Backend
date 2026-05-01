package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.SearchResultDTO;
import in.zidio.zidioconnect.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<List<SearchResultDTO>> globalSearch(@RequestParam(name = "q", defaultValue = "") String query) {
        return ResponseEntity.ok(searchService.globalSearch(query));
    }
}
