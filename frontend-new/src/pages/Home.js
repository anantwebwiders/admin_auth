// src/pages/Home.js
export default function Home() {
  return (
    <div className="relative bg-blueGray-100">
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: "url('/assets/img/profile-cover.jpg')"
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
        </section>

        {/* Add more HTML here from index.html body */}
      </main>
    </div>
  );
}
