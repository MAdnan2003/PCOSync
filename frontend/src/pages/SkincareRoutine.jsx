import { useEffect, useState } from "react";
import axios from "axios";
import { Droplets, Sun, Moon, Sparkles, Leaf, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const morningRoutine = [
  { step: 1, name: "Gentle Cleanser", description: "Use a sulfate-free, pH-balanced cleanser", tip: "Look for niacinamide or salicylic acid", duration: "60s" },
  { step: 2, name: "Balancing Toner", description: "Witch hazel / green tea to minimize pores", tip: "Pat gently, do not rub", duration: "30s" },
  { step: 3, name: "Niacinamide Serum", description: "Regulates oil + reduces inflammation", tip: "Great for hormonal acne", duration: "1–2 min" },
  { step: 4, name: "Lightweight Moisturizer", description: "Oil-free & non-comedogenic", tip: "Oily skin still needs hydration", duration: "30s" },
  { step: 5, name: "SPF 30+ Sunscreen", description: "Prevents dark marks & hyperpigmentation", tip: "Most important AM step", duration: "Generous" }
];

const eveningRoutine = [
  { step: 1, name: "Oil Cleanser", description: "Dissolves makeup & sunscreen", tip: "Massage 60s", duration: "60s" },
  { step: 2, name: "Gentle Cleanser", description: "Double-cleanse to prevent clogging", tip: "Essential for acne-prone skin", duration: "60s" },
  { step: 3, name: "BHA Exfoliant (2-3x/week)", description: "Unclogs pores & reduces breakouts", tip: "Start slow", duration: "2–3 min" },
  { step: 4, name: "Retinoid Treatment", description: "Boosts cell turnover & fades hyperpigmentation", tip: "Alternate nights", duration: "Pea-size" },
  { step: 5, name: "Ceramide Moisturizer", description: "Repairs skin barrier overnight", tip: "Locks in treatment", duration: "30s" }
];


const pcosInfo = [
  { icon: Droplets, title: "Hormonal Acne", description: "PCOS increases oil & causes cystic acne along jawline + chin." },
  { icon: Sparkles, title: "Hyperpigmentation", description: "Dark patches & PIH are common with hormonal imbalance." },
  { icon: Leaf, title: "Oily Skin", description: "Elevated androgens overstimulate sebaceous glands." }
];

/* --- AMAZON LINKS (frontend only — you replace manually) --- */
const productLinks = {
  "Gentle Cleanser": "https://www.amazon.com/CETAPHIL-Hydrating-Sensitive-Fragrance-Non-Foaming/dp/B099N3NM61/ref=sr_1_1?crid=2IPUGD33LCOQZ&dib=eyJ2IjoiMSJ9.EB5dlSZmBwG86JXxnqNQ72P209vJbLZhwCpfnW92h8QKBpnnXp6fprvuwpNx3ppdUtq4xZ0YR2wSGIBsJs4YAh3htadrB7oEtz-CH9Qqjiq7F1lVM0Xl37DVe7wmXWrA5t7SAIchR-Y14gzRZQLdhVuQmhJiyrRwd5-iRTycyRdH-oBZx4ILKZydnQLGo1a6dLm-CJ8GDbcZhL3UvJb-ltTUaaCM6kYk6CSaNoU5H-taOw-X7CoVQU7kx2p_4GtqBb-YEZn796wgIHAaGlVP6ec1Ch20b-k8lIwH2HbXVUk.kqSn2kD2LHeKD73jmRTkD0cR3pgOXZaA2C0wPOFcJtA&dib_tag=se&keywords=Gentle%2BCleanser&qid=1766951834&sprefix=%2Caps%2C286&sr=8-1&th=1",
  "Balancing Toner": "https://www.amazon.com/ACWELL-Licorice-Balancing-Cleansing-Make-Up/dp/B01LZK411L/ref=sr_1_2?dib=eyJ2IjoiMSJ9.VeARTjzA54uQr7LeR_MORPV6eDdHTIZdwW_lTD2PmWWndcssnymSH0sELGFYu2BohMtAeVaQbLmwodn1WLDw_sG3QkcyGh5vZWZpq8OBnzlJKsmEgqMvnQeAJtTQd0XImX_0fSsl4tcoPFqrhCyRgfA4mln5iqK1diAC6vYKDS7XzDLAXcc7yBzhScl8h8Hho9xutPRkPlAxreiA_yxqTXG0dBd9o1btXNhBx-EDgAZRI8kbMJqG1ivjWegf7tnz_PK1I_qiNlYohuOA1XC-PQS63TY5LJ2CvsPuv8wG0Lc.vvUwZS58l68myVCG7buDn4QmhrCkeCB9kxa20icaLbQ&dib_tag=se&keywords=Balancing+Toner&qid=1766951857&sr=8-2",
  "Niacinamide Serum": "https://www.amazon.com/Niacinamide-Moisturizer-Diminishes-Wrinkles-Hyaluronic/dp/B07WSS5M4Z/ref=sr_1_2?crid=384JOPIP2Z7L2&dib=eyJ2IjoiMSJ9.XRj1apipTsPLmKW6kVSS2mnxYYvWejNmNloJ1n1QSSMQaq-DtINFVX--jFgpEYqRQESY2lYyxSPl9tlfOyvlyVocKmj67pMxERE1yGNNkYZSI29UB-0u-NfSH-QR4kyUBG1ql100DIlFXLQRxRnxP56EQav40CuNZ6oj7YJ7cPfWQdCaK-_v5BE39e8qS4HxK2K-eQ9vGPrvtvmT9gQFiTMVRbIQv3_suNGMwbxe2Vnwgiu7m4_AX7ETmHRXqowNWx_FBJz7druMFqA9fETyKJNnypd6oip4Fd29dGY1UEI.mt3qviDZwixkzPZNowGYZDKyW7Gk9ycUeeEfta3DxCc&dib_tag=se&keywords=Niacinamide%2BSerum&qid=1766951880&sprefix=niacinamide%2Bserum%2Caps%2C338&sr=8-2&th=1",
  "Lightweight Moisturizer": "amazon.com/Roche-Posay-Toleriane-Double-Repair-Moisturizer/dp/B01N9SPQHQ/ref=sr_1_3?crid=9DQHX1UOEV70&dib=eyJ2IjoiMSJ9.1lB5h0cR2lH_TCn-JdwI5B-dviCMkqkme7PCwcZbNmkmDlsd29uF3bO0kcZ-57p0RQpvkPKpwioFrTfKBgb4bsE0wKPHvSVKU9r3zSP3LHVaYgvN_CQ1pk05Hg0u3hPnLp12bCWoa0SKlYzpcNxXlpXtjpRYDz--iPqSmM6gQZGopFez2PMwfw6WlbXH3vn7hXAsv_afGydFl_Mj9SdTAIgC6QSp41-VfzI1A_z1m8bqfWJjuFqx2GisOnWMJHqi5sfcKA5s3y10d00oz0T4X8ssY0C6dDzxdXiVxEiFdo0.RRLbRnURgEHpRQo67b9GbZo_HecuMFn-erkT_bk3yEE&dib_tag=se&keywords=Lightweight+Moisturizer&qid=1766951910&sprefix=lightweight+moisturizer%2Caps%2C857&sr=8-3",
  "SPF 30+ Sunscreen": "https://www.amazon.com/Natura-Biss%C3%A9-Essential-Anti-Aging-Protection/dp/B0DKVVKFSW/ref=sr_1_2?crid=11JS91VGHP778&dib=eyJ2IjoiMSJ9.HqaJTWClWR3gzyTFIMmyxl1MSB4i42wR-2q4Di1sEAz3CCXX2yTfrhWRIdEuw13W4ga2MlgKc8iJ7lLVfJA9tcN82UmkdbXOk14BB_TArG8Arev2LiuBuAd9eugpafC_v4saKB06GsTay2aTDAXIMmW63tFBH-AaQOx92pB3IHxRyrnhRNcPIsok1DECcL1CF1J65M0Vo4E7w5sslVav9XcMOEyC2xGc0aBCLnXmZIs5OoCEH7dMtDfTRCREL9SJ-pdm2d4QRBp_PEpyFbqUU0u3yXZAqgg4uS4D2AkFVbQ.NPEdZ8MHZTRHxbanBl_j_ayQXQxU2GS_U7gmH4EXq7s&dib_tag=se&keywords=SPF+30%2B+Sunscreen&qid=1766951943&sprefix=spf+30%2B+sunscreen%2Caps%2C347&sr=8-2",
  "Oil Cleanser": "https://www.amazon.com/Eco-Panda-Bamboo-Cleansing-Oil/dp/B0DJ7FJR2C/ref=sr_1_1?crid=HLTS13739JVA&dib=eyJ2IjoiMSJ9.vgVdvEQBLJbzt9dUnqK-s2MOIl31eMl0Wc61rbuQ_JzJBu0WTflrTPDt6lRcT3xWhN6UW0Ocxcc5CpqXlh3t4VUdoIa0-rBvcc_61heX65qQhlx8_uyyhCyd324giiNROC8Y9_LSli31iRWkGG9VO2kr7aRXxczZgIAjVwNZU-VIuN4JgTXJTZJyL3WRGurPkCdeLLgIMJslmdIAJslNrTIdXVdBqJEBFq1TTPjRvFCNQcMXRVEGOvXp0uc1qnMjfEonyIjt9JYdLkYhnd-mXonfr5H5Tv_vtvAm57k4PWI.AwsD2rQH6YQE7w8gYsztWdlbG_UeGG4dTgO3hJlGr6A&dib_tag=se&keywords=Oil+Cleanser&qid=1766951970&sprefix=spf+30%2B+sunscreen%2Caps%2C338&sr=8-1",
  "BHA Exfoliant (2-3x/week)": "https://www.amazon.com/Paulas-Choice-Pro-Collagen-Moisturizer-Lightweight/dp/B0FR5GYZG2/ref=sr_1_1?crid=21BM7L63GQ6SS&dib=eyJ2IjoiMSJ9.gWt3AAYRcGgPLZJ38GC6JlLGuCIhS49LR_OuIKppqnzWYNOC3KcnyFLJkNg8_rqkUxOw1_DTIEu75uXNaVVY48JrK1jrhFeThv6r5hCacueD2SYhcxhF_Vujk6MzjLdmHh97Z9DVqaUfTwJm0Uqy2wWI2m3tgfmU0boZCiSnL1Wrp5kJC4v3B_trMf54qfNMoNWBOy78HxpX7cf-D6VOw7vpCZ0hJG3KAp2-Ph5n3wuE8CmnzU5k4gAYCL6o0-VO93zI-LklWeBwtNPqJOFH2x3yPaOLgP6djfiPJgLRdnY.jT-ww94ZTMLIKJ8LQrP-eUe4HTmcjEFdlOryFwWPvkQ&dib_tag=se&keywords=BHA+Exfoliant&qid=1766951982&sprefix=bha+exfoliant%2Caps%2C329&sr=8-1",
  "Retinoid Treatment": "https://www.amazon.com/111SKIN-Womens-Black-Diamond-Multicolored/dp/B0CFFJTD2R/ref=sr_1_2?crid=1BAJTRHF6GBZJ&dib=eyJ2IjoiMSJ9.ZTA49ZFCCTwV_a5lPNj-ZHei2aUpTIhQDvTJLalxMujj90wOk1xUI4cBq0Fp71YgOepgK_ePncDGh4Sw4HpcRS-Tw8YAubJmzm0e4YUZ777VaxyOzGQJrpo5BmaBx9tFvJByfHHKNZBslq2NWRBH00P2wOxVd91cbUxquTA0UgKU5eTnfl0n2whkk8hqGsXZTcZRLso6VbnaBILMXGY9NKs-ps6Ob1ZZd9THKZFGg-UiwSjjnnsN8eWJpFxZ8ROZTJGkTqzVHOaQQAHW5hd_EahABVUI2f0OeB5vGrSdTsQ.PpWZZxAK_gwi-AE_NbMOQ-skr5Xm4q1KQWPeJRtE8NI&dib_tag=se&keywords=Retinoid+Treatment&qid=1766951994&sprefix=retinoid+treatment%2Caps%2C331&sr=8-2",
  "Ceramide Moisturizer": "https://www.amazon.com/Couperose-Treatment-Moisturizer-Sensitive-OxygenCeuticals/dp/B078RYFSGC/ref=sr_1_2?crid=2OBNB4937W0ZS&dib=eyJ2IjoiMSJ9.AJptRBEClMiHTFExSGo0bCXsTqJR_WEncbj25THpYdANGuGk2HYAL5J3IFnp3WKt_iIp6wkHFzlZN4Rrym-Ym_Ko2fdtu6x04hEoLQ8OlJmbDXNh-E-G3DZxng4x0n3FCh4BV0_qqGuNxIwOsw_X4l-dxraDCmYRIAYRZiN7JkKC6P6pj4zMM5YeER_2e1F25gi2jYOMGA669fGeizJagQrvi7Jb_cG2dgDtPPh55a4eqw0ZswSYDA-KBUqRKxPvHG-s_cZbz38Lqs-WCup2auUCXy4676SlZIL0aSJd5J8.bb6U_OY9SppfCKXA98WZNu_CBQLdmbWaBi_n0nFaBxQ&dib_tag=se&keywords=Ceramide+Moisturizer&qid=1766952004&sprefix=retinoid+treatment%2Caps%2C361&sr=8-2"
};

const SkincareRoutine = () => {

  const [skinType, setSkinType] = useState("");
  const [routineMode, setRoutineMode] = useState("");
  const [loading, setLoading] = useState(true);

  /* backend structured routine */
  const [routine, setRoutine] = useState({
    morning: [],
    night: [],
    tips: []
  });

  const [activeTab, setActiveTab] = useState("morning");

  /* -------- PROFILE FORM -------- */
  const [form, setForm] = useState({
    skinType: "",
    acneType: "",
    sensitivity: "",
    oilLevel: "",
    lifestyle: "",
    hyperpigmentation: false,
    darkSpots: false
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------- ⭐ TEMPLATE MERGE (for descriptions/durations/tips) ⭐ */
  const applyToTemplate = (list, template) => {
    return list.map((value, i) => {
      if (typeof value === "string") {
        return {
          ...template[i],
          name: value
        };
      }
      return value;
    });
  };

  /* -------- SAVE PROFILE -------- */
  const saveProfile = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/skincare/profile",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      await loadRoutine();
    } catch (err) {
      console.error("Profile save error:", err);
    }
  };

  /* -------- LOAD ROUTINE -------- */
  const loadRoutine = () => {
    axios
      .get("http://localhost:5000/api/skincare/routine", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {

        setRoutineMode(res.data.mode || "");
        setSkinType(res.data.data?.skinType || "");

        // profile-based structured routine
        if (res.data.data?.morning) {
          setRoutine({
            morning: applyToTemplate(res.data.data.morning, morningRoutine),
            night: applyToTemplate(res.data.data.night || [], eveningRoutine),
            tips: res.data.data.tips || []
          });
        }

        // legacy medical fallback
        else if (res.data.data?.routine) {
          setRoutine({
            morning: applyToTemplate(res.data.data.routine, morningRoutine),
            night: [],
            tips: []
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRoutine();
  }, []);

  /* -------- AMAZON CLICK (FIXED) -------- */
  const handleAmazonClick = (step, index, isMorning) => {
    const baseTemplate = isMorning ? morningRoutine : eveningRoutine;
    const templateName = baseTemplate[index]?.name;

    const namesToTry = [];

    if (typeof step === "string") {
      namesToTry.push(step);
    } else if (step?.name) {
      namesToTry.push(step.name);
    }

    if (templateName) {
      namesToTry.push(templateName);
    }

    for (const n of namesToTry) {
      if (productLinks[n]) {
        window.open(productLinks[n], "_blank", "noopener,noreferrer");
        return;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-purple-700 font-semibold">
        ✨ Preparing your skincare routine…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">

      {/* ---------- HERO ---------- */}
      <header className="relative overflow-hidden px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl text-center relative">

          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            <Heart className="mr-1.5 h-3.5 w-3.5" />
            PCOS-Focused Skincare
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-Black">
            Your  Skincare Routine
          </h1>

          {skinType && (
            <span className="mt-4 inline-block px-3 py-1 bg-white/20 rounded-full text-sm text-white">
              Skin Type: <b className="capitalize">{skinType}</b>
            </span>
          )}
        </div>
      </header>

      {/* ---------- PROFILE FORM ---------- */}
      <section className="container mx-auto max-w-3xl px-20 pb-20 mt-24 md:mt-32">
        <Card>
          <CardHeader>
            <CardTitle>Set Your Skincare Profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              The routine automatically adjusts based on your selections
            </p>
          </CardHeader>

          <CardContent className="grid gap-4">

            <div>
              <label>Skin Type</label>
              <select name="skinType" className="w-full border p-2 rounded"
                value={form.skinType} onChange={handleFormChange}>
                <option value="">Select</option>
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Combination">Combination</option>
                <option value="Normal">Normal</option>
                <option value="Sensitive">Sensitive</option>
              </select>
            </div>

            <div>
              <label>Acne Type</label>
              <select name="acneType" className="w-full border p-2 rounded"
                value={form.acneType} onChange={handleFormChange}>
                <option value="">Select</option>
                <option value="Hormonal">Hormonal</option>
                <option value="Inflammatory">Inflammatory</option>
                <option value="Comedonal">Comedonal</option>
                <option value="Cystic">Cystic</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label>Sensitivity</label>
              <select name="sensitivity" className="w-full border p-2 rounded"
                value={form.sensitivity} onChange={handleFormChange}>
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label>Oil Level</label>
              <select name="oilLevel" className="w-full border p-2 rounded"
                value={form.oilLevel} onChange={handleFormChange}>
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>

            <button className="btn btn-primary mt-2" onClick={saveProfile}>
              Save & Generate Routine
            </button>

          </CardContent>
        </Card>
      </section>

      {/* ---------- MODE INDICATOR ---------- */}
      <section className="container mx-auto max-w-3xl px-4 pb-8 mt-24 md:mt-28">
        {routineMode === "profile_based" && (
          <p className="text-green-600 font-semibold">
            ✓ Personalized routine generated from your skincare profile
          </p>
        )}

        {routineMode === "medical_fallback" && (
          <p className="text-amber-600 font-semibold">
            ⚠ Using fallback routine (no saved profile)
          </p>
        )}
      </section>

      {/* ---------- PCOS INFO ---------- */}
      <section className="container mx-auto max-w-6xl px-4 pb-24 mt-24 md:mt-32">
        <div className="grid gap-10 md:grid-cols-3">
          {pcosInfo.map((info) => (
            <Card key={info.title} className="bg-card/50 backdrop-blur-sm hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <info.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle>{info.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- ROUTINE TABS ---------- */}
      <section className="container mx-auto max-w-4xl px-4 pb-24 mt-24 md:mt-32">

        <Tabs value={activeTab} onValueChange={setActiveTab}>

          {/* 🔥 SLIDING TOGGLE ADDED HERE */}
          <TabsList className="relative grid grid-cols-2 w-full mb-10 bg-muted/50 p-2 rounded-2xl">

            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-xl bg-white shadow-sm transition-transform duration-300
                ${activeTab === "evening" ? "translate-x-full" : "translate-x-0"}`}
            />

            <TabsTrigger
              value="morning"
              className={`z-10 gap-2 ${activeTab === "morning" ? "text-foreground" : "text-muted-foreground"}`}
            >
              <Sun className="h-4 w-4" /> Morning Routine
            </TabsTrigger>

            <TabsTrigger
              value="evening"
              className={`z-10 gap-2 ${activeTab === "evening" ? "text-foreground" : "text-muted-foreground"}`}
            >
              <Moon className="h-4 w-4" /> Evening Routine
            </TabsTrigger>

          </TabsList>

          {/* MORNING — backend routine OR fallback */}
          <TabsContent value="morning" className="space-y-6">
            {(routineMode === "profile_based" && routine.morning.length > 0
              ? routine.morning
              : morningRoutine
            ).map((s, i) => (
              <Card
                key={i}
                className="hover:shadow-md cursor-pointer"
                onClick={() => handleAmazonClick(s, i, true)}
              >
                <CardContent className="flex gap-4 p-5">

                  <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shadow">
                    {s.step || i + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-semibold underline">{s.name || s}</h3>
                      {s.duration && <Badge variant="outline">{s.duration}</Badge>}
                    </div>

                    {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                    {s.tip && <p className="text-xs text-primary/80">💡 {s.tip}</p>}
                  </div>

                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* EVENING — backend routine OR fallback */}
          <TabsContent value="evening" className="space-y-6">
            {(routineMode === "profile_based" && routine.night.length > 0
              ? routine.night
              : eveningRoutine
            ).map((s, i) => (
              <Card
                key={i}
                className="hover:shadow-md cursor-pointer"
                onClick={() => handleAmazonClick(s, i, false)}
              >
                <CardContent className="flex gap-4 p-5">

                  <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
                    {s.step || i + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-semibold underline">{s.name || s}</h3>
                      {s.duration && <Badge variant="outline">{s.duration}</Badge>}
                    </div>

                    {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                    {s.tip && <p className="text-xs text-primary/80">💡 {s.tip}</p>}
                  </div>

                </CardContent>
              </Card>
            ))}
          </TabsContent>

        </Tabs>
      </section>

      {/* ---------- CARE TIPS ---------- */}
      {routine.tips.length > 0 && (
        <section className="container mx-auto max-w-3xl px-4 pb-24 pt-4 mt-24 md:mt-32">
          <Card className="bg-amber-50 border-amber-300">
            <CardHeader>
              <CardTitle>Care Tips</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2">
                {routine.tips.map((tip, i) => (
                  <li key={i} className="bg-white p-2 rounded text-sm">
                    💡 {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

    </div>
  );
};

export default SkincareRoutine;
