import makeRequest from './makeRequest';

async function getPosts() {
  const res = await makeRequest("/posts");
  console.log("postlists = ", res);
  return res;
}

async function getPost(id) {
  const res = await makeRequest(`/posts/${id}`);
  console.log("res -->", res);
  return res;
}

export default getPosts;
export { getPost };
