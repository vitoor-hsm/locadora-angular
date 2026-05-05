package com.locadora.backend.exceptions;

import lombok.Data;

import java.io.Serializable;
@Data
// Serializable allows the object to be transformed into JSON
public class StandardError implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long timestamp;
    private Integer status;
    private String error;
    private String message;
    private String path;

    // Empty Constructor (Required for Java to convert to JSON)
    public StandardError() {
    }


    public StandardError(Long timestamp, Integer status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

}