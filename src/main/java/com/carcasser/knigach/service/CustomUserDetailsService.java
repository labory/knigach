package com.carcasser.knigach.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.carcasser.knigach.domain.User;

/**
 * Custom user details service implementation.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        return user == null ? null : new org.springframework.security.core.userdetails.User(
                user.getUsername(), user.getPassword(), user.isActive(), true, true, true,
                AuthorityUtils.createAuthorityList(user.getRole().name()));
    }
}
