package org.dicadeveloper.weplantaforest.common.errorHandling;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
public class IpatException extends Exception {

    private static final long serialVersionUID = 7868399786472157365L;

    private List<IpatErrorInfo> errorInfos;

    public IpatException(String errorCode, String... params){
        errorInfos = new ArrayList<IpatErrorInfo>();
        IpatErrorInfo errorInfo = new IpatErrorInfo(errorCode, params);
        errorInfos.add(errorInfo);
    }
}
