// pages/api/recommend.js
import { PythonShell } from "python-shell";

export default async (req, res) => {
  if (req.method === "POST") {
    let options = {
      mode: "text",
      pythonOptions: ["-u"], // unbuffered output
      args: [JSON.stringify(req.body)],
    };

    PythonShell.run("path/to/recommend.py", options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      console.log("results: %j", results);
      res.status(200).json({ books: JSON.parse(results[0]) });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
