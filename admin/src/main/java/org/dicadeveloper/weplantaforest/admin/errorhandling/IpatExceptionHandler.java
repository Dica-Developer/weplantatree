package org.dicadeveloper.weplantaforest.admin.errorhandling;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

public class IpatExceptionHandler extends ResponseEntityExceptionHandler{

    @ExceptionHandler(value = IpatException.class)
    public ResponseEntity<IpatBackendErrorDTO> handleException(HttpServletResponse response, IpatException ex){
        IpatBackendErrorDTO error = new IpatBackendErrorDTO(ex.getErrorInfos());
        ResponseEntity<IpatBackendErrorDTO> result = new ResponseEntity<IpatBackendErrorDTO>(error, HttpStatus.BAD_REQUEST);
        return result;
    }
}
