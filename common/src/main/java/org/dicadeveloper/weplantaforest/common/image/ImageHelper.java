package org.dicadeveloper.weplantaforest.common.image;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.common.support.StringHelper;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;

@Component
public class ImageHelper {

    protected final Log LOG = LogFactory.getLog(ImageHelper.class.getName());

    private final static int maxSize = 1500;

    public OutputStream writeImageToOutputStream(OutputStream toWrite, String filePath, int width, int height) throws FileNotFoundException, IOException {
        int[] sizes = { width, height };
        if (sizes[0] > maxSize || sizes[1] > maxSize) {
            sizes = scaleSize(sizes);
        }

        FileInputStream inputStream = new FileInputStream(filePath);
        Thumbnails.of(inputStream).size(sizes[0], sizes[1]).toOutputStream(toWrite);
        inputStream.close();

        return toWrite;
    }

    public OutputStream writeImageToOutputStream(OutputStream toWrite, String filePath) throws FileNotFoundException, IOException {
        FileInputStream inputStream = new FileInputStream(filePath);
        FileCopyUtils.copy(new FileInputStream(filePath), toWrite);
        inputStream.close();
        return toWrite;
    }

    public boolean storeImage(MultipartFile file, String folder, String imageName) {
        if (!folderExists(folder)) {
            createNewFolder(folder);
        }
        if (imageNameExists(folder, imageName)) {
            imageName = createNonExistingImageName(folder, imageName);
        }

        byte[] bytes = null;
        try {
            bytes = file.getBytes();
        } catch (IOException e1) {
            LOG.error("Error occured while applying bytes from imageFile: " + file.getName() + "!");
            return false;
        }

        File fileToSave = new File(folder, imageName);
        FileOutputStream fileOutPutStreamfromFileToSave = null;

        try {
            fileOutPutStreamfromFileToSave = new FileOutputStream(fileToSave);
        } catch (FileNotFoundException e) {
            LOG.error("File not found for " + fileToSave.getPath() + "!");
            return false;
        }

        BufferedOutputStream stream = new BufferedOutputStream(fileOutPutStreamfromFileToSave);
        try {
            stream.write(bytes);
            stream.close();
            fileOutPutStreamfromFileToSave.close();
        } catch (IOException e) {
            LOG.error("Error occured while writing stream for " + file.getName() + "!");
            return false;
        }
        return true;
    }

    private int[] scaleSize(int[] sizes) {
        if (sizes[0] >= sizes[1]) {
            double scaledPercent = maxSize * 1.0 / (sizes[0] * 1.0);
            sizes[0] = maxSize;
            double newHeight = scaledPercent * sizes[1] * 1.0;
            sizes[1] = (int) newHeight;
        } else {
            double scaledPercent = maxSize * 1.0 / (sizes[1] * 1.0);
            sizes[1] = maxSize;
            double newWidth = scaledPercent * sizes[0] * 1.0;
            sizes[0] = (int) newWidth;
        }
        return sizes;
    }

    private boolean imageNameExists(String folder, String imageName) {
        return new File(folder + "/" + imageName).exists();
    }

    private boolean folderExists(String folder) {
        return new File(folder).exists();
    }

    private void createNewFolder(String folder) {
        new File(folder).mkdir();
    }

    private String createNonExistingImageName(String folder, String imageName) {
        int imageNumber = 2;
        String newImageName = imageName;
        while (imageNameExists(folder, newImageName)) {
            newImageName = StringHelper.addNumberToFileName(imageName, imageNumber);
            imageNumber++;
        }
        return newImageName;
    }

}
