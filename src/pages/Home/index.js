import React from "react";
import Grid from "@mui/material/Grid";
import "./style.css";
import Searchbar from "../../components/Searchbar";
import GroupRequest from "../../components/GroupRequest";
import { Card } from "@mui/material";
import FriendRequest from "../../components/FriendRequest";
import Friends from "../../components/Friends";
import Groups from "../../components/Groups";
import Userlist from "../../components/Userlist";
import Blockuser from "../../components/Blockuser";

const Home = () => {
  return (
    <>
      <div className="home_items">
        <Grid container>
          <Grid padding={3} item xs={4}>
            <Card>
              <Searchbar />
            </Card>
            <Card className="group_req">
              <GroupRequest />
            </Card>
          </Grid>
          <Grid padding={3} item xs={4}>
            <Card>
              <Friends />
            </Card>
          </Grid>
          <Grid padding={3} item xs={4}>
            <Card>
              <Userlist />
            </Card>
          </Grid>
          <Grid padding={3} item xs={4}>
            <Card>
              <FriendRequest />
            </Card>
          </Grid>
          <Grid padding={3} item xs={4}>
            <Card>
              <Groups />
            </Card>
          </Grid>
          <Grid padding={3} item xs={4}>
            <Card>
              <Blockuser />
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Home;
