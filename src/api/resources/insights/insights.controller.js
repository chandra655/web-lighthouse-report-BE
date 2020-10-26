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
    const result = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const docDate = new Date(data.date).getTime();
      if (docDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime()) {
        result.push({ id: doc.id, ...doc.data() });
      }
    });
    res.status(200).json(result);
  }
  static async findAllByRouteAndWeek(req, res) {
    const { routeId } = req.params;
    const snapshot = await piDB
      // .where("date", "<=", "new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)")
      .where("routeId", "==", routeId)
      .get();
    if (snapshot.empty) {
      res.json({ results: [] });
    }
    const result = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const docDate = new Date(data.date).getTime();
      if (docDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime()) {
        result.push({ id: doc.id, ...doc.data() });
      }
    });
    const calculatedResult = result.reduce(
      (_acc, _result) => {
        _acc.performance += _result.performance;
        _acc.accessibility += _result.accessibility;
        _acc.seo += _result.seo;
        _acc.pwa += _result.pwa;
        _acc.fcp += parseInt(_result["first-contentful-paint"].slice(0, 1), 10);
        _acc.fmp += parseInt(_result["first-meaning-fulpaint"].slice(0, 1), 10);
        _acc.cls += parseInt(
          _result["cumulative-layout-shift"].slice(0, 1),
          10
        );
        _acc.si += parseInt(_result["speed-index"].slice(0, 1), 10);
        _acc.lcp += parseInt(
          _result["largest-contentful-paint"].slice(0, 1),
          10
        );
        _acc.ti += parseInt(_result["time-to-interactive"].slice(0, 1), 10);
        _acc.tbt += parseInt(_result["total-blocking-time"].slice(0, 1), 10);
        _acc["best-practices"] += _result["best-practices"];
        return _acc;
      },
      {
        performance: 0,
        accessibility: 0,
        seo: 0,
        pwa: 0,
        "best-practices": 0,
        fcp: 0,
        fmp: 0,
        cls: 0,
        si: 0,
        lcp: 0,
        ti: 0,
        tbt: 0,
      }
    );
    Object.keys(calculatedResult).forEach((_key) => {
      calculatedResult[_key] = (calculatedResult[_key] / result.length).toFixed(
        1
      );
    });
    res.status(200).json(calculatedResult);
  }
}

export default InsightsController;
