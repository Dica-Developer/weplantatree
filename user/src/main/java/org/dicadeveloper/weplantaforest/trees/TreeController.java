package org.dicadeveloper.weplantaforest.trees;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.FileSystemInjector;
import org.dicadeveloper.weplantaforest.common.image.ImageHelper;
import org.dicadeveloper.weplantaforest.support.Uris;
import org.dicadeveloper.weplantaforest.views.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired) )
public class TreeController {
    
    protected final Log LOG = LogFactory.getLog(TreeController.class.getName());

    private @NonNull TreeRepository _treeRepository;

    private @NonNull ImageHelper _imageHelper;
    
    @RequestMapping(value = Uris.TREE + "{id}", method = RequestMethod.GET)
    @JsonView(Views.PlantedTree.class)
    public Tree list(@PathVariable("id") long id) {
        return _treeRepository.findOne(id);
    }

    @RequestMapping(value = Uris.TREES, method = RequestMethod.GET)
    @JsonView(Views.PlantedTree.class)
    public Page<Tree> list(@Param("page") int page, @Param("size") int size) {
        return _treeRepository.findAll(new PageRequest(page, size, new Sort(new Order(Direction.DESC, "plantedOn"))));
    }

    @RequestMapping(value = Uris.TREES_BY_USER + "{userName}", method = RequestMethod.GET)
    @JsonView(Views.PlantedTree.class)
    public Page<Tree> findTreesByOwnerId(@PathVariable("userName") String userName, @Param("page") int page, @Param("size") int size) {
        return _treeRepository.findTreesByUserName(userName, new PageRequest(page, size, new Sort(new Order(Direction.DESC, "plantedOn"))));
    }

    @RequestMapping(value = Uris.TREES_BY_PROJECT + "{projectId}", method = RequestMethod.GET)
    @JsonView(Views.PlantedTree.class)
    public Page<Tree> findTreesByProjectId(@PathVariable("projectId") long projectId, @Param("page") int page, @Param("size") int size) {
        return _treeRepository.findTreesByProjectId(projectId, new PageRequest(page, size, new Sort(new Order(Direction.DESC, "plantedOn"))));
    }
    
    @RequestMapping(value = Uris.TREE_IMAGE + "{imageName:.+}/{width}/{height}", method = RequestMethod.GET, headers = "Accept=image/jpeg, image/jpg, image/png, image/gif")
    public ResponseEntity<?> getImage(HttpServletResponse response, @PathVariable String imageName, @PathVariable int width, @PathVariable int height) {
        String filePath = FileSystemInjector.getTreeFolder() + "/" + imageName;
        try {
            _imageHelper.writeImageToOutputStream(response.getOutputStream(), filePath, width, height);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            LOG.error("Error occured while trying to get image " + imageName + " in folder: " + filePath, e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
