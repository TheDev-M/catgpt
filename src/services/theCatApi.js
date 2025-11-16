const CAT_API_BASE = "https://api.thecatapi.com/v1";

export async function getRandomBreedWithImage() {
  const breedsRes = await fetch(`${CAT_API_BASE}/breeds`);
  if (!breedsRes.ok) {
    const err = new Error("BREEDS_LOAD_FAILED");
    err.status = breedsRes.status;
    throw err;
  }
  const breeds = await breedsRes.json();
  const breed = breeds[Math.floor(Math.random() * breeds.length)];

  const imageRes = await fetch(
    `${CAT_API_BASE}/images/search?breed_ids=${breed.id}`
  );
  if (!imageRes.ok) {
    const err = new Error("BREED_IMAGE_LOAD_FAILED");
    err.status = imageRes.status;
    throw err;
  }
  const img = await imageRes.json();

  return { ...breed, image: img[0]?.url || "" };
}
