import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/Firebase";
import gallery1 from "../../assets/gallery1.png";
import gallery2 from "../../assets/gallery2.png";
import gallery3 from "../../assets/gallery3.png";
import gallery4 from "../../assets/gallery4.png";
import gallery5 from "../../assets/gallery5.png";
import gallery6 from "../../assets/gallery6.png";
import gallery7 from "../../assets/gallery7.png";
import gallery8 from "../../assets/gallery8.png";
import blog1 from "../../assets/blog1.png";
import blog2 from "../../assets/blog2.png";
import avatar from "../../assets/avatar.png";
import blogOffer from "../../assets/blogOffer.png";
import ButtonShape from "../../components/button/Button";

import Colors from "../../utils/Colors";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkIcon from "@mui/icons-material/Link";
import SellIcon from "@mui/icons-material/Sell";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useNavigate } from "react-router-dom";
import "./Blog.css";
import { Snackbar } from "@mui/material";

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
interface Tag {
  id: number;
  name: string;
}
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
const Blog: React.FC = () => {
  const { id: blogId } = useParams();
  const [blogData, setBlogData] = useState<BlogInterface | null>(null);
  const [visibleComments, setVisibleComments] = useState(3);
  const [commentName, setCommentName] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const secDescription =
    "Mauris pretium elit a dui pulvinar, in ornare sapien euismod. Nullam interdum nisl ante, id feugiat quam euismod commodo. Sed ultrices lectus ut iaculis rhoncus. Aenean non dignissim justo, at fermentum turpis. Sed molestie, ligula ut molestie ultrices, tellus ligula viverra neque, malesuada consectetur diam sapien volutpat risus.Quisque eget tortor lobortis, facilisis metus eu, elementum est. Nunc sit amet erat quis ex convallis suscipit. ur ridiculus mus.";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return; // Ensure blogId is valid

      try {
        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlogData(docSnap.data() as BlogInterface);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchBlog();
  }, [blogId, success]);

  const handleAddComment = async () => {
    if (!commentName || !commentContent) {
      setAlert(true);
      return;
    }

    const newComment = {
      name: commentName,
      date: new Date().toISOString().split("T")[0], 
      content: commentContent,
    };

    try {
      if (!blogId) {
        return;
      }
      const blogRef = doc(db, "blogs", blogId);

      await updateDoc(blogRef, {
        comments: arrayUnion(newComment),
        noOfComments: increment(1),
      });

      
      setSuccess(true);
      setCommentName("");
      setCommentContent("");
      setAlert(false);
      console.log("Comment added successfully!");
      
    } catch (error) {
      console.error("Error adding comment: ", error);
      // alert("Failed to add comment.");

    }
  };
  const commentsOfBlog = blogData?.comments
    .slice(0, visibleComments)
    .map((comment, index) => (
      <div className="comment" key={index}>
        <div className="comment-writer">
          <img src={avatar} alt="" className="avatar" />
          <div>
            <p className="writer-name">
              {comment.name} •{" "}
              <span style={{ color: Colors.Gray5 }}>{comment.date}</span>
            </p>
            <p className="comment-content" style={{ color: Colors.Gray6 }}>
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    ));

  const handleLoadMore = () => {
    if (blogData?.comments && visibleComments >= blogData.comments.length) {
      setVisibleComments(3); // Reset to show only 3 comments
    } else {
      setVisibleComments((prev) => prev + 3); // Show next 3 comments
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={success}
        onClose={() => setSuccess(false)}
        autoHideDuration={1000}
        message="Comment added successfully!"
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "1.2rem",
            padding: "20px",
            minWidth: "400px",
            backgroundColor: Colors.Primary,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
      <div className="container">
        <div className="blog-body">
          <div className="blog-content">
            <img src={blogData?.imageUrl} alt="" className="blog-image" />
            <div className="writer">
              <p>
                <SellIcon style={{ color: Colors.Primary }} />
                <span style={{ color: Colors.Gray6 }}>Food</span>
              </p>
              <p>
                <PersonIcon style={{ color: Colors.Primary }} />
                <span style={{ color: Colors.Gray6 }}>By Admin</span>
              </p>
              <p>
                <ChatBubbleIcon style={{ color: Colors.Primary }} />{" "}
                <span style={{ color: Colors.Gray6 }}>
                  {blogData?.noOfComments} Comments
                </span>
              </p>
            </div>
            <h1 className="blog-title">{blogData?.name}</h1>
            <div className="author">
              <div className="writer-info">
                <img src={avatar} alt="" className="avatar" />
                <div>
                  <p className="writer-name">by Admin</p>
                  <p className="date" style={{ color: Colors.Gray6 }}>
                    {blogData?.date} • <span>5 min read</span>{" "}
                  </p>
                </div>
              </div>
              <div className="social-icons">
                <FacebookIcon
                  className="icon"
                  style={{ color: Colors.Gray6 }}
                />
                <InstagramIcon
                  className="icon"
                  style={{ color: Colors.Gray6 }}
                />
                <PinterestIcon
                  className="icon"
                  style={{ color: Colors.Gray6 }}
                />
                <XIcon className="icon" style={{ color: Colors.Gray6 }} />
                <LinkIcon className="icon" style={{ color: Colors.Gray6 }} />
              </div>
            </div>
            <h1 className="blog-title-sec">{blogData?.name}</h1>
            <p className="blog-description" style={{ color: Colors.Gray5 }}>
              {blogData?.description}
              {secDescription}
            </p>
            <div className="img-container">
              <div className="blog-imgs">
                <img src={blog1} alt="" className="blog-img" />
                <img src={blog2} alt="" className="blog-img" />
              </div>
            </div>
            <p className="blog-description" style={{ color: Colors.Gray5 }}>
              {blogData?.description} {secDescription}
              Sed dictum non nulla eu imperdiet. Duis elit libero, vulputate
              quis vehicula ut, vestibulum ut mauris. Nullam non felis varius
              dui rutrum rutrum in a nisi. Suspendisse elementum rutrum lorem
              sed luctus. Proin iaculis euismod metus non sollicitudin. Duis vel
              luctus lacus. Nullam faucibus iaculis convallis. In ullamcorper
              nibh ipsum, eget lacinia eros pulvinar a. Integer accumsan arcu
              nec faucibus ultricies.
            </p>
            <div className="blog-offer">
              <div className="blog-offer-content">
                <div className="blog-offer-text">
                  <p style={{ color: Colors.Gray4 }}>Summer Sales</p>
                  <h1 style={{ color: Colors.Gray1 }}>Fresh Fruit</h1>
                  <ButtonShape
                    width="150px"
                    height="50px"
                    backgroundColor={Colors.Primary}
                    textColor={Colors.White}
                    onClick={() => navigate("/shop")}
                  >
                    Shop Now
                  </ButtonShape>
                </div>
                <div>
                  <img src={blogOffer} alt="" />
                </div>
              </div>
              <div className="line"></div>
            </div>
            <div className="comments-section">
              <h1 className="comments-header">Leave a comment</h1>
              <div className="comment-form">
                <div className="comment-form-inputs">
                  <div className="name-input">
                    <input
                      type="text"
                      placeholder="Name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                    />
                    <p
                      className={
                        alert ? "comment-alert" : "comment-alert-hidden"
                      }
                    >
                      Please fill in the Name field{" "}
                    </p>
                  </div>
                  <div className="email-input">
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      className="email"
                    />
                  </div>
                </div>
                <textarea
                  cols={30}
                  rows={3}
                  placeholder="Write your comment here…"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <p className={alert ? "comment-alert" : "comment-alert-hidden"}>
                  Please fill in the Comment field{" "}
                </p>
                <ButtonShape
                  width="170px"
                  height="50px"
                  backgroundColor={Colors.Primary}
                  textColor={Colors.White}
                  onClick={handleAddComment}
                >
                  Post Comment
                </ButtonShape>
              </div>
              <h1 className="comments-header">Comments</h1>
              <div className="comments">{commentsOfBlog}</div>
              {blogData?.comments && blogData.comments.length > 3 && (
                <ButtonShape
                  width="150px"
                  height="50px"
                  backgroundColor={Colors.White}
                  textColor={Colors.Primary}
                  className="load-more"
                  onClick={handleLoadMore}
                >
                  {visibleComments >= blogData?.comments.length
                    ? "Show Less"
                    : "Load More"}
                </ButtonShape>
              )}
            </div>
          </div>
          <div className="sideBar-filerts">
            <div className="categories">
              <h1 className="categories-header">Top Categories</h1>
              {categories.map((category) => (
                <div className="category-item" key={category.id}>
                  <p style={{ color: Colors.Gray9 }}>{category.name}</p>
                  <p style={{ color: Colors.Gray5 }}>({category.number})</p>
                </div>
              ))}
            </div>
            <div className="tags">
              <h1 className="tags-header">Popular Tags</h1>
              <div className="tags-content">
                {tags.map((tag) => (
                  <div
                    className={blogData?.tags.includes(tag.name) ? "tag-active" : "tag"}
                    key={tag.id}
                    // onClick={() => handleTagClicked(tag)}
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
        </div>
      </div>
    </>
  );
};

export default Blog;
