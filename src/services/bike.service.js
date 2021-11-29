export async function fetchBikes(queryString) {
  try {
    const data = await fetch(`https://619f74851ac52a0017ba4819.mockapi.io/bikes${queryString || ''}`);
    if (data.ok) {
      const { bikes, total } = await data.json();
      return {
        data: bikes || [],
        total,
        error: false,
      };
    } else {
      return {
        error: true,
      };
    }
  } catch {
    return {
      error: true,
    };
  }
}

export async function fetchBike(id) {
  try {
    const data = await fetch(`https://619f74851ac52a0017ba4819.mockapi.io/bikes/${id}`);
    if (data.ok) {
      const bike = await data.json();
      return {
        data: bike || {},
        error: false,
      };
    } else {
      return {
        error: true,
      };
    }
  } catch {
    return {
      error: true,
    };
  }
}

export async function updateBike(id, payload) {
  try {
    const data = await fetch(`https://619f74851ac52a0017ba4819.mockapi.io/bikes/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (data.ok) {
      const bike = await data.json();
      return {
        data: bike || {},
        error: false,
      };
    } else {
      return {
        error: true,
      };
    }
  } catch {
    return {
      error: true,
    };
  }
}

export async function deleteBike(id) {
  try {
    const data = await fetch(`https://619f74851ac52a0017ba4819.mockapi.io/bikes/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (data.ok) {
      const bike = await data.json();
      return {
        data: bike || {},
        error: false,
      };
    } else {
      return {
        error: true,
      };
    }
  } catch {
    return {
      error: true,
    };
  }
}
