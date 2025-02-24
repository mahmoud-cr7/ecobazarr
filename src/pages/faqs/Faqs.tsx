/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import "./faqs.css";
import faqsImg from "../../assets/faqs.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import Colors from "../../utils/Colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
interface FaqsProps {}

interface Faq {
  id: string;
  question: string;
  answer: string;
}

const Faqs: React.FC<FaqsProps> = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(1);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const faqsCol = collection(db, "faq");
        const faqSnapshot = await getDocs(faqsCol);
        const faqList: Faq[] = faqSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Faq)
        );
        setFaqs(faqList);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };
  const totalPages = Math.ceil(Object.keys(faqs).length / ITEMS_PER_PAGE);
  const testimonialsArray = Object.values(faqs);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedFaqs = testimonialsArray.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const ArrowBack = (
    <ArrowBackIcon
      style={{
        color: Colors.White,
        backgroundColor: Colors.Primary,
        borderRadius: "50%",
      }}
    />
  );
  const ArrowForward = (
    <ArrowForwardIcon
      style={{
        color: Colors.White,
        backgroundColor: Colors.Primary,
        borderRadius: "50%",
      }}
    />
  );
  return (
    <div className="container">
      <div className="faqs">
        <div className="content">
          <h1
            style={{ color: darkMode ? Colors.Gray1 : "" }}
            className="title"
          >
            Welcome, Let’s Talk About Our Ecobazar
          </h1>
          {paginatedFaqs.map((faq) => (
            <div
              key={faq.id}
              className={openFaqId === faq.id ? "faq-opened" : "faq"}
              style={{ backgroundColor: darkMode ? Colors.Gray9 : "" }}
            >
              <div
                className={
                  openFaqId === faq.id ? "faq-header-opened" : "faq-header"
                }
              >
                <h2
                  className={openFaqId === faq.id ? "question-opened" : ""}
                  onClick={() => toggleFaq(faq.id)}
                >
                  {faq.question}
                </h2>
                <button
                  className={
                    openFaqId === faq.id
                      ? "toggle-button-opened"
                      : "toggle-button"
                  }
                  style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
                  onClick={() => toggleFaq(faq.id)}
                >
                  {openFaqId === faq.id ? "-" : "+"}
                </button>
              </div>
              {openFaqId === faq.id && <p className="answer">{faq.answer}</p>}
            </div>
          ))}
          <Stack spacing={3} mt={2} className="pagination">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: () => ArrowBack,
                    next: () => ArrowForward,
                  }}
                  {...item}
                />
              )}
            />
          </Stack>
        </div>
        <div className="img">
          <img src={faqsImg} alt="faqs" />
        </div>
      </div>
    </div>
  );
};

export default Faqs;
