import Link from "next/link";
import { Component } from "react";
import { Post } from "../models/post";
import { PostView } from "./post-view";
import { Box, Grid } from '@mui/material';

export class PostsView extends Component<{ posts: Post[] }> {
  render() {
    const { posts } = this.props;
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={6}>
          {posts.map((p) => (
            <Grid key={p.id} item xs={4}>
               <PostView post={p}></PostView>
            </Grid>
          ))}
        </Grid>

        </Box>
      </div>
    );
  }
}
