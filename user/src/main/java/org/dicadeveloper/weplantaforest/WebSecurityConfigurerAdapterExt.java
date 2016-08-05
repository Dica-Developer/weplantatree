package org.dicadeveloper.weplantaforest;

import org.dicadeveloper.weplantaforest.encryption.PasswordEncrypter;
import org.dicadeveloper.weplantaforest.security.StatelessAuthenticationFilter;
import org.dicadeveloper.weplantaforest.security.StatelessLoginFilter;
import org.dicadeveloper.weplantaforest.security.TokenAuthenticationService;
import org.dicadeveloper.weplantaforest.security.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

@EnableWebSecurity
@Configuration
public class WebSecurityConfigurerAdapterExt extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService _userDetailsService;

    @Autowired
    private PasswordEncrypter _passwordEncrypter;

    @Autowired
    private TokenAuthenticationService tokenAuthenticationService;

    public WebSecurityConfigurerAdapterExt() {
        super(true);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.exceptionHandling()
            .and()
            .anonymous()
            .and()
            .servletApi();
            // .and()
            // .headers()
            // .cacheControl();

        // only for testing, concrete config has to be implemented later
        http.authorizeRequests()
            .antMatchers(HttpMethod.GET, "/simplePlantProposalForTrees/2")
            .hasRole("USER")
            .and()

            // custom JSON based authentication by POST of
            // {"name":"<name>","password":"<password>"} which sets the
            // token
            // header upon authentication
            .addFilterBefore(new StatelessLoginFilter("/api/login", tokenAuthenticationService, _userDetailsService, authenticationManager()), UsernamePasswordAuthenticationFilter.class)

            // custom Token based authentication based on the header previously
            // given to the client
            .addFilterBefore(new StatelessAuthenticationFilter(tokenAuthenticationService), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(_userDetailsService)
            .passwordEncoder(_passwordEncrypter);
    }

    @Override
    protected UserDetailsService userDetailsService() {
        return _userDetailsService;
    }
}
