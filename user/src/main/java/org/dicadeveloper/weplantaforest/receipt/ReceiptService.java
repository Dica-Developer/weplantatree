package org.dicadeveloper.weplantaforest.receipt;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.Locale;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dicadeveloper.weplantaforest.cart.Cart;
import org.dicadeveloper.weplantaforest.cart.CartRepository;
import org.dicadeveloper.weplantaforest.common.mail.MailHelper;
import org.dicadeveloper.weplantaforest.messages.MessageByLocaleService;
import org.dicadeveloper.weplantaforest.user.User;
import org.dicadeveloper.weplantaforest.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReceiptService {

    private @NonNull ReceiptRepository _receiptRepository;

    private @NonNull UserRepository _userRepository;
    
    private @NonNull CartRepository _cartRepository;

    private @NonNull MailHelper _mailHelper;

    private @NonNull MessageByLocaleService _messageByLocaleService;

    private final static String RELATIVE_STATIC_IMAGES_PATH = "/static/images/pdf";

    protected final Log LOG = LogFactory.getLog(ReceiptService.class.getName());

    public void sendReceiptMail(Long userId, Long receiptId) {
        Receipt receipt = _receiptRepository.findOne(receiptId);
        PdfReceiptView pdf = new PdfReceiptView();
        File pdfFile = new File("Spendenquittung_" + receipt.getInvoiceNumber().replaceAll("/", "-") + ".pdf");
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(pdfFile);
        } catch (FileNotFoundException e1) {
            LOG.error("Error occured while creating PDF file! ", e1);
        }
        User user = _userRepository.findOne(userId);
        try {
            pdf.writePdfDataToOutputStream(fos, RELATIVE_STATIC_IMAGES_PATH, receipt);
            new Thread(new Runnable() {
                public void run() {
                    String mailSubject = _messageByLocaleService.getMessage("mail.receipt.subject", Locale.GERMAN);
                    String mailTemplateText = _messageByLocaleService.getMessage("mail.receipt.text", Locale.GERMAN);
                    mailTemplateText = mailTemplateText.replace("%userName%", user.getName());
                    _mailHelper.sendAMessageWithAttachement(mailSubject, mailTemplateText, user.getMail(), pdfFile);
                    pdfFile.delete();
                    receipt.setSentOn(System.currentTimeMillis());
                    _receiptRepository.save(receipt);
                    if(receipt.getCarts() != null && receipt.getCarts().size() > 0) {
                        for(Cart cart: receipt.getCarts()) {
                            cart.setReceiptSent(true);
                            _cartRepository.save(cart);
                        }
                    }
                }
            }).start();
        } catch (Exception e) {
            LOG.error("Error occured while creating PDF for receipt with id " + receiptId + "!\n", e);
        }

    }

}
