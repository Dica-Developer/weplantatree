package org.dicadeveloper.weplantaforest.admin.errorhandling;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
public class IpatException extends Exception{/**
     * 
     */
    private static final long serialVersionUID = 7868399786472157365L;

    private final List<IpatErrorInfo> errorInfos;
    
    
    public IpatException(String errorCode){
        IpatErrorInfo errorInfo = new IpatErrorInfo(errorCode, null);
        errorInfos = new ArrayList<IpatErrorInfo>();
        errorInfos.add(errorInfo);
    }
    
    public IpatException(String errorCode, Object... params){
        errorInfos = new ArrayList<IpatErrorInfo>();
        IpatErrorInfo errorInfo = new IpatErrorInfo(errorCode, params);
        errorInfos.add(errorInfo);
    }
}