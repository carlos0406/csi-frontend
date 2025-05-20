import Image from "next/image";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="text-3xl mb-12">Página não encontrada</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/daniel.jpg"
          alt="page not found"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
}
