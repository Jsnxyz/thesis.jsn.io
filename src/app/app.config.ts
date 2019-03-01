const CONFIG = {
  N : 200,
  
  // SPECTRUM: [
  //   "rgb(222,237,250)",
  //   "rgb(176,212,243)",
  //   "rgb(128,186,236)",
  //   "rgb(77,158,228)",
  //   "rgb(38,137,223)",
  //   "rgb(0,116,217)",
  //   "rgb(0,106,197)",
  //   "rgb(0,94,176)",
  //   "rgb(0,82,154)",
  //   "rgb(0,60,113)",
  // ]
  SPECTRUM: ["rgb(104,175,252)", "rgb(165,227,173)", "rgb(65,216,244)"]
}
export const COLORMAP = new Map();
//Engineering
COLORMAP.set("Programming", CONFIG.SPECTRUM[0]);
COLORMAP.set("Engineering", CONFIG.SPECTRUM[0]);
COLORMAP.set("Materials Science", CONFIG.SPECTRUM[0]);
COLORMAP.set("Computer Graphics", CONFIG.SPECTRUM[0]);
COLORMAP.set("Energy Engineering", CONFIG.SPECTRUM[0]);
COLORMAP.set("Information Technology", CONFIG.SPECTRUM[0]);
COLORMAP.set("Electrical Engineering", CONFIG.SPECTRUM[0]);
COLORMAP.set("Computer Science", CONFIG.SPECTRUM[0]);
COLORMAP.set("Simulation Model", CONFIG.SPECTRUM[0]);
COLORMAP.set("Aeronautics", CONFIG.SPECTRUM[0]);
COLORMAP.set("Rail Transportation", CONFIG.SPECTRUM[0]);
COLORMAP.set("Marine Navigation", CONFIG.SPECTRUM[0]);

//Science
COLORMAP.set("Chemistry", CONFIG.SPECTRUM[1]);
COLORMAP.set("Physics", CONFIG.SPECTRUM[1]);
COLORMAP.set("Mathematics", CONFIG.SPECTRUM[1]);
COLORMAP.set("Biology", CONFIG.SPECTRUM[1]);
COLORMAP.set("Archaeology", CONFIG.SPECTRUM[1]);
COLORMAP.set("Ecology", CONFIG.SPECTRUM[1]);
COLORMAP.set("Geology", CONFIG.SPECTRUM[1]);

// Health Sciences
COLORMAP.set("Food & Diet", CONFIG.SPECTRUM[2]);
COLORMAP.set("Dentistry", CONFIG.SPECTRUM[2]);
COLORMAP.set("Medical Science", CONFIG.SPECTRUM[2]);
COLORMAP.set("Health", CONFIG.SPECTRUM[2]);
COLORMAP.set("Medicine", CONFIG.SPECTRUM[2]);

//International Studies
COLORMAP.set("US Politics", CONFIG.SPECTRUM[3]);
COLORMAP.set("French Revolution", CONFIG.SPECTRUM[3]);
COLORMAP.set("European Studies", CONFIG.SPECTRUM[3]);
COLORMAP.set("England", CONFIG.SPECTRUM[3]);
COLORMAP.set("Latin America", CONFIG.SPECTRUM[3]);
COLORMAP.set("Ireland", CONFIG.SPECTRUM[3]);
COLORMAP.set("US History", CONFIG.SPECTRUM[3]);
COLORMAP.set("British Politics", CONFIG.SPECTRUM[3]);
COLORMAP.set("Bristish Politics", CONFIG.SPECTRUM[3]);
COLORMAP.set("American East Coast", CONFIG.SPECTRUM[3]);
COLORMAP.set("South East Asia", CONFIG.SPECTRUM[3]);
COLORMAP.set("African American Studies", CONFIG.SPECTRUM[3]);

//Humanities
COLORMAP.set("British Literature", CONFIG.SPECTRUM[4]);
COLORMAP.set("Christianity", CONFIG.SPECTRUM[4]);
COLORMAP.set("Mythology", CONFIG.SPECTRUM[4]);
COLORMAP.set("Spirituality", CONFIG.SPECTRUM[4]);
COLORMAP.set("Controversial Letters", CONFIG.SPECTRUM[4]);
COLORMAP.set("Anthropology", CONFIG.SPECTRUM[4]);
COLORMAP.set("Philosophy", CONFIG.SPECTRUM[4]);
COLORMAP.set("Travel", CONFIG.SPECTRUM[4]);
COLORMAP.set("Language", CONFIG.SPECTRUM[4]);
COLORMAP.set("Religion", CONFIG.SPECTRUM[4]);
COLORMAP.set("Judaism", CONFIG.SPECTRUM[4]);
COLORMAP.set("History", CONFIG.SPECTRUM[4]);
COLORMAP.set("Humanities", CONFIG.SPECTRUM[4]);
COLORMAP.set("Literature", CONFIG.SPECTRUM[4]);

//Social Science
COLORMAP.set("Education", CONFIG.SPECTRUM[5]);
COLORMAP.set("Child care", CONFIG.SPECTRUM[5]);
COLORMAP.set("Cultural Studies", CONFIG.SPECTRUM[5]);
COLORMAP.set("Women Studies", CONFIG.SPECTRUM[5]);
COLORMAP.set("Psychology", CONFIG.SPECTRUM[5]);
COLORMAP.set("Revolution", CONFIG.SPECTRUM[5]);
COLORMAP.set("Geography", CONFIG.SPECTRUM[5]);
COLORMAP.set("Agriculture", CONFIG.SPECTRUM[5]);
COLORMAP.set("Fisheries", CONFIG.SPECTRUM[5]);
COLORMAP.set("Immigration", CONFIG.SPECTRUM[5]);
COLORMAP.set("Communism", CONFIG.SPECTRUM[5]);
COLORMAP.set("Socialism", CONFIG.SPECTRUM[5]);

// Govt. Politics & law.
COLORMAP.set("Criminal Justice", CONFIG.SPECTRUM[6]);
COLORMAP.set("Legislature", CONFIG.SPECTRUM[6]);
COLORMAP.set("Parliamentary Committee", CONFIG.SPECTRUM[6]);
COLORMAP.set("Economy", CONFIG.SPECTRUM[6]);
COLORMAP.set("Trade Policy", CONFIG.SPECTRUM[6]);
COLORMAP.set("Political Science", CONFIG.SPECTRUM[6]);
COLORMAP.set("United Nation", CONFIG.SPECTRUM[6]);
COLORMAP.set("War & Military", CONFIG.SPECTRUM[6]);
COLORMAP.set("National Security", CONFIG.SPECTRUM[6]);
COLORMAP.set("Litigation", CONFIG.SPECTRUM[6]);

//General Information Sources
COLORMAP.set("Research", CONFIG.SPECTRUM[7]);
COLORMAP.set("General Analysis", CONFIG.SPECTRUM[7]);
COLORMAP.set("Statistical Analysis", CONFIG.SPECTRUM[7]);
COLORMAP.set("Monograph", CONFIG.SPECTRUM[7]);
COLORMAP.set("Symposium", CONFIG.SPECTRUM[7]);
COLORMAP.set("Temporal", CONFIG.SPECTRUM[7]);
COLORMAP.set("Journals", CONFIG.SPECTRUM[7]);
COLORMAP.set("Biography", CONFIG.SPECTRUM[7]);

//Business 
COLORMAP.set("Business Management", CONFIG.SPECTRUM[8]);
COLORMAP.set("HR Management", CONFIG.SPECTRUM[8]);
COLORMAP.set("Banking", CONFIG.SPECTRUM[8]);
COLORMAP.set("Vocational Studies", CONFIG.SPECTRUM[8]);

//Arts 
COLORMAP.set("Poetry", CONFIG.SPECTRUM[9]);
COLORMAP.set("Drama", CONFIG.SPECTRUM[9]);
COLORMAP.set("Film", CONFIG.SPECTRUM[9]);
COLORMAP.set("Architecture", CONFIG.SPECTRUM[9]);
COLORMAP.set("Music", CONFIG.SPECTRUM[9]);
COLORMAP.set("Visual Art", CONFIG.SPECTRUM[9]);
COLORMAP.set("Photography", CONFIG.SPECTRUM[9]);
COLORMAP.set("Poetry & Fiction", CONFIG.SPECTRUM[9]);

export default CONFIG;