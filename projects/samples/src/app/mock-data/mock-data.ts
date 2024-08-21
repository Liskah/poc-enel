export const mockData = [
  {
    _id: {
      $oid: '63fd04a05e02624f8ba9e7bb',
    },
    idCompany: '100000000000000000000214',
    validationDate: {
      $date: '2023-01-24T00:00:00.000Z',
    },
    operazione: 'MIGRAZIONE',
    dataEfficacia: {
      $date: '2023-01-24T00:00:00.000Z',
    },
    capitaleTotale: 1000,
    isGestionePercentuale: false,
    commento: 'Migrazione Feb. 2023 - vn',
    azioniModel: [
      {
        codAzione: 'COS',
        azioniQuote: 1000,
        dirittiDiVoto: 1000,
        isValoreNominale: false,
        isGestioneLiberaVoto: false,
        capitale: 1000,
        valoreNominale: 0,
        rapportoDirittoDiVoto: '1:1',
        isPresenzaCapitale: true,
        valuta: 'BRL',
      },
    ],
    azionistiModel: [
      {
        codAzione: 'COS',
        codSottoScrittore: '2',
        quantitaAzioni: 999,
        percentualeDetenuta: 99.9,
        percentualeVoti: 99.9,
        capitale: 999,
        idAzionista: '100000000000000000001173',
        voto: 999,
        adjustment: 0,
        percentualeDetenutaConAdj: 99.9,
        idAzionistaObj: {
          $oid: '100000000000000000001173',
        },
      },
      {
        codAzione: 'COS',
        codSottoScrittore: '2',
        quantitaAzioni: 1,
        percentualeDetenuta: 0.1,
        percentualeVoti: 0.1,
        capitale: 1,
        idAzionista: '100000000000000000000294',
        voto: 1,
        adjustment: 0,
        percentualeDetenutaConAdj: 0.1,
        idAzionistaObj: {
          $oid: '100000000000000000000294',
        },
      },
    ],
    isAdjCancellato: false,
    isCongelato: false,
    createdAt: {
      $date: '2023-02-27T19:29:36.992Z',
    },
    updateAt: {
      $date: '2023-02-27T19:29:36.992Z',
    },
    _class: 'com.enel.virtualentity.model.CapitaleModel',
    idCompanyObj: {
      $oid: '100000000000000000000214',
    },
  },

  {
    _id: {
      $oid: '63fd048e5e02624f8ba9e736',
    },
    idCompany: '100000000000000000000015',
    validationDate: {
      $date: '2023-01-24T00:00:00.000Z',
    },
    operazione: 'MIGRAZIONE',
    dataEfficacia: {
      $date: '2023-01-24T00:00:00.000Z',
    },
    capitaleTotale: 100000,
    isGestionePercentuale: false,
    commento: 'Migrazione Feb. 2023',
    azioniModel: [
      {
        codAzione: 'Shares',
        azioniQuote: 100000,
        dirittiDiVoto: 100000,
        isValoreNominale: true,
        isGestioneLiberaVoto: false,
        capitale: 100000,
        valoreNominale: 1,
        rapportoDirittoDiVoto: '1:1',
        isPresenzaCapitale: true,
        valuta: 'UYU',
      },
    ],
    azionistiModel: [
      {
        codAzione: 'Shares',
        codSottoScrittore: '2',
        quantitaAzioni: 100000,
        percentualeDetenuta: 100,
        percentualeVoti: 100,
        capitale: 100000,
        idAzionista: '100000000000000000000560',
        voto: 100000,
        adjustment: 0,
        percentualeDetenutaConAdj: 100,
        idAzionistaObj: {
          $oid: '100000000000000000000560',
        },
      },
    ],
    isAdjCancellato: false,
    isCongelato: false,
    createdAt: {
      $date: '2023-02-27T19:29:18.649Z',
    },
    updateAt: {
      $date: '2023-02-27T19:29:18.649Z',
    },
    _class: 'com.enel.virtualentity.model.CapitaleModel',
    idCompanyObj: {
      $oid: '100000000000000000000015',
    },
  },
];
