package com.expenseflow.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class H2FunctionInitializer {

    @Autowired
    private DataSource dataSource;

    public static String dateFormat(Date date, String pattern) {
        if (date == null) return null;
        if (pattern == null) pattern = "%Y %m %d";
        String javaPattern = pattern.replace("%Y", "yyyy").replace("%m", "MM").replace("%d", "dd");
        return new SimpleDateFormat(javaPattern).format(date);
    }

    @PostConstruct
    public void init() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            DatabaseMetaData metaData = conn.getMetaData();
            if (metaData.getDatabaseProductName().toLowerCase().contains("h2")) {
                stmt.execute("CREATE ALIAS IF NOT EXISTS date_format FOR \"com.expenseflow.config.H2FunctionInitializer.dateFormat\"");
            }
        } catch (Exception e) {
            System.err.println("Could not initialize H2 date_format alias: " + e.getMessage());
        }
    }
}
