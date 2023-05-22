import React from "react";
import "./style.css";
import Grid from "@mui/material/Grid";
import { Card } from "@mui/material";
import MsgFriend from "../../components/MsgFriend";
import MsgGroup from "../../components/MsgGroup";

const Messages = () => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Grid
            height="100vh"
            container
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={3}>
            <Grid height="50%" width="100%" className="msg-list" item>
              <Card>
                <MsgFriend />
              </Card>
            </Grid>
            <Grid height="50%" width="100%" className="msg-list" item>
              <Card>
                <MsgGroup />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          xs=8
        </Grid>
      </Grid>
    </>
  );
};

export default Messages;
