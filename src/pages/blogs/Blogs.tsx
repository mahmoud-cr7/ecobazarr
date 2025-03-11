/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useEffect, useState } from "react";
import "./blogs.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import Colors from "../../utils/Colors";
import gallery1 from "../../assets/gallery1.png";
import gallery2 from "../../assets/gallery2.png";
import gallery3 from "../../assets/gallery3.png";
import gallery4 from "../../assets/gallery4.png";
import gallery5 from "../../assets/gallery5.png";
import gallery6 from "../../assets/gallery6.png";
import gallery7 from "../../assets/gallery7.png";
import gallery8 from "../../assets/gallery8.png";
import ButtonShape from "../../components/button/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SellIcon from "@mui/icons-material/Sell";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
interface BlogsProps {
  // Define your props here
}
interface Tag {
  id: number;
  name: string;
}
const categories = [
  {
    name: "Fresh Fruit",
    id: 1,
    number: 134,
  },
  {
    name: "Vegetables",
    id: 2,
    number: 150,
  },
  {
    name: "Cooking",
    id: 3,
    number: 54,
  },
  {
    name: "Meat",
    id: 4,
    number: 200,
  },
  {
    name: "Fish",
    id: 5,
    number: 50,
  },
  {
    name: "Snacks",
    id: 6,
    number: 47,
  },
  {
    name: "Beverages",
    id: 7,
    number: 43,
  },
  {
    name: "Beauty & Health",
    id: 8,
    number: 38,
  },
  {
    name: "Bread & Bakery",
    id: 9,
    number: 15,
  },
];
const tags: Tag[] = [
  {
    id: 1,
    name: "Healthy",
  },
  {
    id: 2,
    name: "Low fat",
  },
  {
    id: 3,
    name: "Vegetarian",
  },
  {
    id: 4,
    name: "Bread",
  },
  {
    id: 5,
    name: "Kid foods",
  },
  {
    id: 6,
    name: "Vitamins",
  },
  {
    id: 7,
    name: "Snacks",
  },
  {
    id: 8,
    name: "Tiffin",
  },
  {
    id: 9,
    name: "Meat",
  },
  {
    id: 10,
    name: "Dinner",
  },
  {
    id: 11,
    name: "Lunch",
  },
];
const galleriesImgs = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
];
interface Comment {
  name: string;
  date: string;
  content: string;
}

interface BlogInterface {
  id: string;
  name: string;
  date: string;
  tags: string[];
  imageUrl: string;
  description: string;
  noOfComments: number;
  comments: Comment[];
}

const Blogs: React.FC<BlogsProps> = () => {
  const [blogs, setBlogs] = useState<BlogInterface[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogInterface[]>([]);
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogsData: BlogInterface[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogInterface[];
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const handleTagClicked = (tag: Tag) => {
    setActiveTag(tag.id); // Set the active tag
    const filtered = blogs.filter((blog) => blog.tags.includes(tag.name));
    setFilteredBlogs(filtered);
  };
  const handleSort = (arrange: string) => {
    if (arrange === "newest") {
      setFilteredBlogs((prev) =>
        [...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setBlogs((prev) =>
        [...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    } else {
      setFilteredBlogs((prev) =>
        [...prev].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      setBlogs((prev) =>
        [...prev].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const filtered = blogs.filter((blog) =>
      blog.description.toLowerCase().includes(query)
    );
    setFilteredBlogs(filtered);
  };
  const handleReadMore = (blog: BlogInterface) => {
    navigate(`/blog/${blog.id}`);
  };
  return (
    <div className="container">
      <div className="blogs">
        <div className="sideBar-filerts">
          <div className="search">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              onChange={handleSearch}
            />
          </div>
          <div className="categories">
            <h1 className="categories-header">Top Categories</h1>
            {categories.map((category) => (
              <div className="category-item" key={category.id}>
                <p style={{ color: darkMode ? Colors.White : Colors.Gray9 }}>
                  {category.name}
                </p>
                <p style={{ color: Colors.Gray5 }}>({category.number})</p>
              </div>
            ))}
          </div>
          <div className="tags">
            <h1 className="tags-header">Popular Tags</h1>
            <div className="tags-content">
              {tags.map((tag) => (
                <div
                  className={activeTag === tag.id ? "tag-active" : "tag"}
                  key={tag.id}
                  onClick={() => handleTagClicked(tag)}
                >
                  <p className="tag-name">{tag.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="gallery">
            <h1 className="gallery-header">Our Gallery</h1>
            <div className="gallery-content">
              {galleriesImgs.map((img, index) => (
                <div className="gallery-item" key={index}>
                  <img src={img} alt="gallery" />
                </div>
              ))}
            </div>
          </div>
          <div className="recently-added">
            <h1 className="recently-added-header">Recently Added</h1>
          </div>
        </div>
        <div className="blogs-content">
          <div className="sort">
            <div className="sort-content">
              <p>Sort by:</p>
              <select
                style={{ backgroundColor: darkMode ? Colors.Gray8 : "" }}
                name="sort"
                id="sort"
                className="sort-select"
                defaultValue="newest"
                onClick={(e) => handleSort(e.currentTarget.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div className="res">
              {filteredBlogs.length > 0 ? filteredBlogs.length : blogs.length}{" "}
              <span style={{ color: Colors.Gray6 }}>Results Found</span>
            </div>
          </div>
          <div className="blogs-list">
            {(filteredBlogs.length > 0 ? filteredBlogs : blogs).map(
              (blog, indx) => (
                <div className="news" key={indx}>
                  <div className="news-img">
                    <img src={blog.imageUrl} alt="news" />
                    <p
                      style={{ color: darkMode ? Colors.Gray9 : Colors.Gray9 }}
                      className="date"
                    >
                      {blog.date.split("-")[2]}{" "}
                      <span
                        style={{
                          color: darkMode ? Colors.Gray9 : Colors.Gray9,
                        }}
                      >
                        {monthNames[parseInt(blog.date.split("-")[1], 10) - 1]}
                      </span>
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
                      <ChatBubbleIcon style={{ color: Colors.Gray4 }} />{" "}
                      {blog.noOfComments} Comments
                    </p>
                  </div>
                  <div className="news-content">
                    <h1>{blog.description}</h1>
                  </div>
                  <ButtonShape
                    width="150px"
                    height="50px"
                    backgroundColor={darkMode ? Colors.Gray8 : Colors.Gray0_5}
                    textColor={Colors.Primary}
                    onClick={() => handleReadMore(blog)}
                    className="read-more"
                  >
                    Read More <ArrowForwardIcon />
                  </ButtonShape>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
