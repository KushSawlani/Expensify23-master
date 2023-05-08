import client from "./client";

export const sendOTP = async (phoneNumber) => {
  try {
    const { data } = await client.post(`/send-otp?phoneNumber=${phoneNumber}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const { data } = await client.post(
      `/verify-otp?phoneNumber=${phoneNumber}&otp=${otp}`
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const createUser = async (object) => {
  try {
    const { data } = await client.post(`/user/add`, object);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getUsers = async () => {
  try {
    const { data } = await client.get(`/user/get/all`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getUsersByName = async (query) => {
  try {
    const { data } = await client.get(`/user/get/userByName?name=${query}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const addTransaction = async (object) => {
  try {
    const { data } = await client.put(`/user/tx/add`, object);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getTransaction = async (userId, txId) => {
  try {
    const { data } = await client.get(`/user/tx/get/${userId}/${txId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const updateTransaction = async (txId, object) => {
  try {
    const { data } = await client.put(`/user/tx/update/${txId}`, object);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const deleteTransaction = async (object) => {
  try {
    const { data } = await client.put(`/user/tx/delete`, object);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const fetchLatestTransactions = async (userId) => {
  try {
    const { data } = await client.get(
      `/user/fetchLatestTransactions/${userId}`
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const fetchCategories = async (userId) => {
  try {
    const { data } = await client.get(`/user/${userId}/catwise`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const fetchCategoryWiseExpense = async (userId, category) => {
  try {
    const { data } = await client.get(
      `/user/${userId}/cat?category=${category}`
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const fetchCurrentMonthTransactions = async (userId) => {
  try {
    const { data } = await client.get(
      `/user/fetchCurrentMonthTransactions/${userId}`
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const fetchTodaysTransactions = async (userId, obj) => {
  try {
    const { data } = await client.post(
      `/user/fetchTodaysTransactions/${userId}`,
      obj
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const updateBudget = async (userId, object, config) => {
  try {
    const { data } = await client.put(
      `/user/updateBudget/${userId}`,
      object,
      config
    );

    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const updateUserInfo = async (object) => {
  try {
    const { data } = await client.put(`/user/update`, object);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getBudget = async (userId) => {
  try {
    const { data } = await client.get(`/user/getBudget/${userId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getUserInfo = async (userId) => {
  try {
    const { data } = await client.get(`/user/getUserInfo/${userId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const getAllTxs = async (userId) => {
  try {
    const { data } = await client.get(`/user/txs/${userId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const clearAllTxs = async (userId) => {
  try {
    const { data } = await client.get(`/user/clear-txs/${userId}`);
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

// register expo token
export const saveExpoToken = async (token, id) => {
  try {
    const { data } = await client.put(`/user/expoPushTokens`, { token, id });
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};
