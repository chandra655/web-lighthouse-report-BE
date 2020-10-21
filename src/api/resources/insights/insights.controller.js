import firebase from "../../../firebase/init";

const piDB = firebase.firestore().collection("performance-results");

class InsightsController {
  static async findAll(req, res) {
    const snapshot = await piDB.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(data);
  }
  static async findAllByRoute(req, res) {
    const { routeId } = req.params;
    const snapshot = await piDB.where("routeId", "==", routeId).get();
    if (snapshot.empty) {
      res.json({ results: [] });
    }
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(data);
  }
}

export default InsightsController;
