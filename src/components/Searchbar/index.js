import React from "react";
import "./style.css";
import Grid from "@mui/material/Grid";
import { GoSearch } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";

const Searchbar = () => {
  return (
    <>
      <div className="search_bar">
        <Grid container>
          <Grid className="icon_input" item xs={12}>
            <div className="search_icon">
              <GoSearch />
            </div>
            <div className="search_input">
              <input type="text" placeholder="Search..." />
            </div>
            <div className="search_option">
              <BsThreeDotsVertical />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Searchbar;
