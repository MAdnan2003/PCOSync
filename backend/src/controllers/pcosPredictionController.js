import axios from "axios";

export const predictPCOS = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.ML_URL}/predict`,
      req.body
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "PCOS prediction failed",
      error: error.message
    });
  }
};
