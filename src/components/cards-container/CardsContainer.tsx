/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ButtonShape from "../button/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./cardsContainer.css";
import Colors from "../../utils/Colors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
interface CardsContainerProps {
  children: React.ReactNode;
  header: string;
  onClick?: () => void;
}

const CardsContainer: React.FC<CardsContainerProps> = ({
  children,
  header,
  onClick,
}: CardsContainerProps) => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className="cards-container">
      <div className="header">
        <h1 style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}>
          {header}
        </h1>
        <ButtonShape height="50px" textColor={Colors.Primary} onClick={onClick}>
          View All
          <ArrowForwardIcon />
        </ButtonShape>
      </div>
      <div className="cards">{children}</div>
    </div>
  );
};

export default CardsContainer;
