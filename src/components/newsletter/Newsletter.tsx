import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./newsletter.css";
import newsletter from "../../assets/newsletter.png";
import ButtonShape from "../button/Button";
import Colors from "../../utils/Colors";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface NewsletterProps {
  newsletterOpen: boolean;
  onClose?: () => void; // Add an onClose prop to update parent state
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Newsletter: React.FC<NewsletterProps> = ({ newsletterOpen, onClose }) => {
  const [open, setOpen] = useState(newsletterOpen);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    setOpen(newsletterOpen); // Sync state when prop changes
  }, [newsletterOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose?.(); // Notify parent component that modal is closing
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
        style={{
          backgroundColor: darkMode ? Colors.Gray8 : "",}}
        dividers>
          <div className="newsletter-container">
            <img src={newsletter} alt="newsletter" className="newsletter" />
            <div className="newsletter-content">
              <h1
              style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}
              className="newsletter-title">Subcribe to Our Newsletter</h1>
              <p className="newsletter-text" style={{color: Colors.Gray5}}>
                Subscribe to our newlletter and Save your{" "}
                <span className="money" style={{ color: Colors.Warning }}>20% money</span> with discount code
                today.
              </p>
              <div className="subscribe-form-input">
                <input
                style={{ color: darkMode ? Colors.Gray1 : "" }}
                type="email" placeholder="Enter your email" />
                <ButtonShape
                  width="120px"
                  height="40px"
                  textColor={Colors.White}
                  backgroundColor={Colors.Primary}
                >
                  Subscribe
                </ButtonShape>
              </div>

              <div className="remember-me" style={{ color: Colors.Gray5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      style={{ color: Colors.Primary }}
                    />
                  }
                  label="Do not show this window"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default Newsletter;
