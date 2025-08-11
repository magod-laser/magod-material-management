let API = process.env.REACT_APP_API_KEY;
export default {
  getCustomers: async (response) => {
    const rawResponse = await fetch(`${API}/customers/allcustomers`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const content = await rawResponse.json();
    response(content);
  },
};
