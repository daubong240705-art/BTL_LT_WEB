package com.movieapp.backend.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RestResponse<T> {
    private int statusCode;
    private Object error;
    private Object message;
    private T data;

}
