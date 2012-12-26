package com.carcasser.knigach.web;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Handles all main application's requests.
 */
@Controller
public class HomeController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @RequestMapping(value = "/save", method = RequestMethod.POST, consumes = "application/json", produces = "text/plain")
    public @ResponseBody String save(@RequestBody String jsonBody) {
        return update(jsonBody, null);
    }

    @RequestMapping(value = "/save/{code}", method = RequestMethod.POST, consumes = "application/json", produces = "text/plain")
    public @ResponseBody String save(@RequestBody String jsonBody, @PathVariable String code) {
        return update(jsonBody, code);
    }

    protected String update(String jsonBody, String code) {
        DBObject books = new BasicDBObject("books", JSON.parse(jsonBody));
        if (code != null && code.trim().length() > 0) {
            books.put("_id", new ObjectId(code));
        }
        mongoTemplate.getCollection("data").save(books);
        return books.get("_id").toString();
    }

    @RequestMapping(value = "/books/{code}", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody String getBooks(@PathVariable String code, HttpServletRequest httpRequest) {
        DBObject id = new BasicDBObject("_id", new ObjectId(code));
        DBObject data = mongoTemplate.getCollection("data").findOne(id);
        return data != null ? JSON.serialize(data.get("books")) : "";
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "home";
    }

    @RequestMapping(value = "/{code}", method = RequestMethod.GET)
    public String index(@ModelAttribute("code") String code) {
        return "home";
    }

}
