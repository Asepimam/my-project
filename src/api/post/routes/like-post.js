module.exports = {
    routes  : [
       {
            method: "PUT",
            path: '/posts/:id/likes',
            handler: 'api::post.post.likePosts',
       }
    ],
}