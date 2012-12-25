package com.carcasser.knigach.service;

import org.bson.types.ObjectId;
import org.springframework.data.repository.CrudRepository;
import com.carcasser.knigach.domain.User;

/**
 * User repository.
 */
public interface UserRepository extends CrudRepository<User, ObjectId> {

    User findByUsername(String username);
}
