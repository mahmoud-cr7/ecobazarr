
import React, {useState } from "react";
import ButtonShape from "../../components/button/Button";
import "./Home.css";
import Colors from "../../utils/Colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SellIcon from "@mui/icons-material/Sell";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import carIcon from "../../assets/car_icon.png";
import shopIcon from "../../assets/shop_icon.png";
import supportIcon from "../../assets/suport_icon.png";
import shippingIcon from "../../assets/shipping_icon.png";
import CardsContainer from "../../components/cards-container/CardsContainer";
import Categories from "../../components/categories/Categories";
import { useNavigate } from "react-router-dom";
import new1 from "../../assets/new1.png";
import new2 from "../../assets/new2.png";
import new3 from "../../assets/new3.png";
import Products from "../../components/products/Products";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import StarIcon from "@mui/icons-material/Star";
import user from "../../assets/user.png";
import Newsletter from "../../components/newsletter/Newsletter";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
interface HomeProps {
  // Define your props here
  newsletterOpen: boolean;
}
const shippingServices = {
  FreeShipping: {
    title: "Free Shipping",
    description: "Free shipping on all order",
    icon: carIcon,
  },
  Support24: {
    title: "Customer Support 24/7",
    description: "Instant access to Support",
    icon: supportIcon,
  },
  SecurePayment: {
    title: "100% Secure Payment",
    description: "We ensure your money is save",
    icon: shopIcon,
  },
  MoneyBack: {
    title: "Money-Back Guarantee",
    description: "30 Days Money-Back Guarantee",
    icon: shippingIcon,
  },
};

const Home: React.FC<HomeProps> = (
  { newsletterOpen } = { newsletterOpen: false }
) => {
  const [timeLeft, ] = useState(20 * 24 * 60 * 60); // 20 days in seconds
  // useEffect(() => {
  //   if (timeLeft === 0) return; // Stop the timer when it reaches 0

  //   // Set up the timer
  //   const timer = setInterval(() => {
  //     setTimeLeft((prevTime) => prevTime - 1); // Decrease timeLeft by 1 every second
  //   }, 1000);

  //   // Clean up the timer when the component unmounts or timeLeft reaches 0
  //   return () => clearInterval(timer);
  // }, [timeLeft]);

  const formatTime = (time: number) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;
    return { days, hours, minutes, seconds };
  };

  const news = {
    new1: {
      id: 1,
      date: ["29", "Jul"],
      description:
        "Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.",
      image: new1,
    },
    new2: {
      id: 2,
      date: ["1", "Aug"],
      description: "Eget lobortis lorem lacinia. Vivamus pharetra semper,",
      image: new2,
    },
    new3: {
      id: 3,
      date: ["31", "Nov"],
      description: "Maecenas blandit risus elementum mauris malesuada.",
      image: new3,
    },
  };
  const testimonials = {
    testimonial1: {
      name: "John Doe",
      position: "Home Chef",
      description:
        "The grocery delivery was fast, and the quality of the produce was excellent! I love how fresh everything was.",
      rating: 5,
    },
    testimonial2: {
      name: "Jane Smith",
      position: "Busy Mom",
      description:
        "This service has saved me so much time. The groceries are always fresh, and the delivery is on time.",
      rating: 4.5,
    },
    testimonial3: {
      name: "Michael Johnson",
      position: "Fitness Enthusiast",
      description:
        "I love the organic options available. It’s made meal prepping so much easier for me.",
      rating: 5,
    },
    testimonial4: {
      name: "Emily Brown",
      position: "College Student",
      description:
        "Affordable and convenient! I don’t have a car, so this service is a lifesaver for me.",
      rating: 4,
    },
    testimonial5: {
      name: "David Wilson",
      position: "Retired Teacher",
      description:
        "The customer service is fantastic, and the groceries are always fresh. Highly recommend!",
      rating: 5,
    },
    testimonial6: {
      name: "Sarah Davis",
      position: "Working Professional",
      description:
        "I love how easy it is to order online. The delivery is always prompt, and the quality is top-notch.",
      rating: 4.5,
    },
    testimonial7: {
      name: "Chris Evans",
      position: "Food Blogger",
      description:
        "The variety of products is amazing, and I love the local and organic options. Great service!",
      rating: 5,
    },
    testimonial8: {
      name: "Laura Martinez",
      position: "Small Business Owner",
      description:
        "This service has made my life so much easier. I can focus on my business while they handle my groceries.",
      rating: 4,
    },
    testimonial9: {
      name: "Daniel Taylor",
      position: "Health Coach",
      description:
        "I appreciate the focus on healthy and organic options. It aligns perfectly with my lifestyle.",
      rating: 5,
    },
    testimonial10: {
      name: "Olivia Anderson",
      position: "Stay-at-Home Parent",
      description:
        "The delivery is always on time, and the groceries are fresh. It’s a huge help for my family.",
      rating: 4.5,
    },
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(
    Object.keys(testimonials).length / ITEMS_PER_PAGE
  );
  const testimonialsArray = Object.values(testimonials);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedTestimonials = testimonialsArray.slice(
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
    <>
      <div className="home container">
        <div className="banner">
          <div className="content">
            <h1 style={{ color: Colors.White }}>
              Fresh & Healthy Organic Food
            </h1>
            <div className="sale-info" style={{ color: Colors.White }}>
              <p className="sale-text">
                Sale up to{" "}
                <span style={{ backgroundColor: Colors.Warning }}>30% OFF</span>
              </p>
              <p>Free shipping on all your order.</p>
            </div>
          </div>
          <ButtonShape
            width="50%"
            height="50px"
            backgroundColor={darkMode ? Colors.Gray7 : Colors.White}
            textColor={Colors.Primary}
          >
            Shop Now <ArrowForwardIcon />
          </ButtonShape>
        </div>
        <div className="side-container">
          <div className="sale">
            <p style={{ color: Colors.Gray9 }}>Summer Sale</p>
            <h1 style={{ color: Colors.Primary }}>75% OFF</h1>
            <p style={{ color: Colors.Gray6 }}>Only Fruit & Vegetable</p>
            <ButtonShape width="70%" height="50px" textColor={Colors.Primary}>
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
          <div className="deal">
            <p style={{ color: Colors.White }}>Best Deal</p>
            <h1>Special Products Deal of the Month</h1>
            <ButtonShape
              width="70%"
              height="50px"
              backgroundColor={darkMode ? Colors.Gray7 : Colors.White}
              textColor={Colors.Primary}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
        </div>
      </div>
      <div className="container">
        <div
          style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
          className="services "
        >
          {Object.keys(shippingServices).map((key) => {
            const service =
              shippingServices[key as keyof typeof shippingServices];
            return (
              <div className="service" key={key}>
                <img src={service.icon} alt={key} />
                <div>
                  <h3>{service.title}</h3>
                  <p style={{ color: darkMode ? Colors.Gray4 : Colors.Gray6 }}>
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container">
        <CardsContainer
          header="Popular Categories"
          onClick={() => {
            navigate("/categories");
          }}
        >
          <Categories />
        </CardsContainer>
      </div>
      <div className="container">
        <CardsContainer
          header="Popular Products"
          onClick={() => {
            navigate("/products");
          }}
        >
          <Products />
        </CardsContainer>
      </div>
      <div className="container">
        <div className="offers">
          <div className="sale sale-1">
            <p style={{ color: Colors.Gray9 }}>Best Deals</p>
            <h1 style={{ color: darkMode ? Colors.Gray9 : Colors.Gray9 }}>
              Sale of the Month
            </h1>
            <div>
              <div className="countdown-timer">
                <div className="time-section">
                  <span className="time-value">{days}</span>
                  <span className="time-label">DAYS</span>
                </div>
                :
                <div className="time-section">
                  <span className="time-value">{hours}</span>
                  <span className="time-label">HOURS</span>
                </div>
                :
                <div className="time-section">
                  <span className="time-value">{minutes}</span>
                  <span className="time-label">MINS</span>
                </div>
                :
                <div className="time-section">
                  <span className="time-value">{seconds}</span>
                  <span className="time-label">SECS</span>
                </div>
              </div>
            </div>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
          <div className="sale sale-2">
            <p style={{ color: Colors.White }}>85% Fat Free</p>
            <h1 style={{ color: Colors.White }}>Low-Fat Meat</h1>
            <p style={{ color: Colors.White }}>
              Started at <span style={{ color: Colors.Warning }}>$79.99</span>
            </p>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={darkMode ? Colors.Gray7 : Colors.White}
              textColor={Colors.Primary}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
          <div className="sale sale-3">
            <p style={{ color: Colors.White }}>Summer Sale</p>
            <h1 style={{ color: Colors.White }}>100% Fresh Fruit</h1>
            <p style={{ color: Colors.White }}>
              Up to
              <span style={{ color: Colors.Warning }} className="sale-span">
                {" "}
                64% OFF
              </span>
            </p>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="summer-sale">
          <div className="flex-2"></div>
          <div className="flex-1">
            <h3 style={{ color: Colors.White }}>Summer Sale</h3>
            <h1 style={{ color: Colors.White }}>
              <span style={{ color: Colors.Warning }}>37%</span>
              OFF
            </h1>
            <p style={{ color: Colors.Gray4 }}>
              Free on all your order, Free Shipping and 30 days money-back
              guarantee
            </p>
            <ButtonShape
              width="200px"
              height="50px"
              backgroundColor={Colors.Primary}
              textColor={Colors.White}
            >
              Shop Now <ArrowForwardIcon />
            </ButtonShape>
          </div>
        </div>
      </div>
      <div className="container">
        <h1
          style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}
          className="section-header"
        >
          Leatest News
        </h1>
        <div className="leatest-news">
          {Object.keys(news).map((indx) => {
            const newBody = news[indx as keyof typeof news];
            return (
              <div
                style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
                className="news"
                key={indx}
              >
                <div className="news-img" key={indx}>
                  <img src={newBody.image} alt="news" />
                  <p
                    style={{ color: darkMode ? Colors.Gray9 : Colors.Gray9 }}
                    className="date"
                  >
                    {newBody.date[0]} <span>{newBody.date[1]}</span>
                  </p>
                </div>
                <div className="writer">
                  <p>
                    <SellIcon style={{ color: Colors.Gray4 }} /> Food
                  </p>
                  <p>
                    <PersonIcon style={{ color: Colors.Gray4 }} /> By Admin
                  </p>
                  <p>
                    <ChatBubbleIcon style={{ color: Colors.Gray4 }} /> 3
                    Comments
                  </p>
                </div>
                <div className="news-content">
                  <h1>{newBody.description}</h1>
                </div>
                <ButtonShape
                  width="150px"
                  height="50px"
                  backgroundColor={darkMode ? Colors.Gray7 : Colors.Gray0_5}
                  textColor={Colors.Primary}
                  className="read-more"
                >
                  Read More <ArrowForwardIcon />
                </ButtonShape>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="pb-3 pt-3 mt-3"
        style={{ backgroundColor: darkMode ? Colors.Gray8 : Colors.Gray0_5 }}
      >
        <div className="container">
          <h1
            style={{ color: darkMode ? Colors.Gray1 : Colors.Gray9 }}
            className="section-header"
          >
            Testimonials
          </h1>
          <div className="testimonials">
            {paginatedTestimonials.map((testimonial, indx) => (
              <div
                style={{ backgroundColor: darkMode ? Colors.Gray7 : "" }}
                className="testimonial"
                key={indx}
              >
                <div className="testimonial-header">
                  <FormatQuoteIcon
                    style={{ color: Colors.Primary }}
                    className="quote"
                  />
                  <p>{testimonial.description}</p>
                </div>
                <div className="testimonial-footer">
                  <div className="testimonial-info">
                    <img src={user} alt="user" />
                    <div>
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.position}</p>
                    </div>
                  </div>
                  <div className="rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < testimonial.rating ? (
                          <StarIcon style={{ color: "gold" }} />
                        ) : (
                          <StarIcon style={{ color: Colors.Gray4 }} />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      </div>
      <Newsletter newsletterOpen={newsletterOpen} />
    </>
  );
};

export default Home;
