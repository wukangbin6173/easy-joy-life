package com.easyjoylife.config;

import com.easyjoylife.service.AdminManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 管理后台接口的轻量登录态校验。
 */
@Component
@RequiredArgsConstructor
public class AdminAuthFilter extends OncePerRequestFilter {

    private static final String ADMIN_API_PREFIX = "/api/admin/";
    private static final String LOGIN_PATH = "/api/admin/auth/login";

    private final AdminManagementService adminManagementService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!requiresAdminToken(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);
        if (adminManagementService.validateToken(token).isPresent()) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"code\":401,\"message\":\"未登录或登录已过期\",\"data\":null}");
    }

    private boolean requiresAdminToken(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path != null
                && path.startsWith(ADMIN_API_PREFIX)
                && !LOGIN_PATH.equals(path)
                && !"OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    private String resolveToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring("Bearer ".length()).trim();
        }
        return request.getHeader("X-Admin-Token");
    }
}
