import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Capacities />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function Capacities() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let capacitiesText = "carregando...";

  if (!isLoading && data) {
    const { version, max_connections, opened_connections } =
      data.dependencies.database;
    capacitiesText = (
      <>
        <div>Versão do banco de dados: {version}</div>
        <div>
          conexões abertas: {opened_connections}/{max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      <div>{capacitiesText}</div>
    </>
  );
}
