This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running the Project

- Visit the site at this link:

OR

- Run the site locally by running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Summary and Features of Project

The project is a Twitter clone that allows users to post tweets, edit as well as publish/unpublish tweets, and include images in their tweets. On the home page, I've included a basic paginated feed where the latest tweets are displayed. Users can see tweets without having an account on the site, but in order to post, they must authenticate themselves through Google. The site utilizes Firebase to have custom and unique usernames, and also has a combination of server-side rendering (for loading the real-time tweets coming in on the home page), and static-site-generation and incremental-site-regeneration (for periodically updating the posts themselves). There is also a search bar that allows users to search for other user profiles, where they can see the posts they've made.

# Time Spent Developing

I spent approximately 5-6 hours developing this project.

# Incomplete Features

- For the search bar, I wasn't able to make it autocomplete users based on what is currently in the input field. I would most likely do this in a similar way to how I check for unique usernames, by periodically checking if any usernames in the database match the search term, and if so, which ones.
- I wanted to add a way for users to like and comment on tweets. I'd likely do this by adding subcollections in the database under each tweet, showing which users have liked the tweet, and the content of the comments.
- I'd like to have styled the site better to make it resemble the actual Twitter UI.
