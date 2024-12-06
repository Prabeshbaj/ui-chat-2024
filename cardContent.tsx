const CardContent = ({ visibleCardsCount }: { visibleCardsCount: number }) => {
  const headers = useAuthHeaders();
  const dispatch = useDispatch<AppDispatch>();
  const [renderComponent, setRenderComponent] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [randomCards, setRandomCards] = useState<Array<any>>([]);
  const [visibleCards, setVisibleCards] = useState(visibleCardsCount);
  const sendingIcon = assets.sending_icon;
  const [refreshClick, setRefreshClick] = useState(false);
  const [cardContent, setCardContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleClick = (text: string, role: string, style: string) => {
    const inputElement = document.querySelector('#inputBar') as HTMLInputElement;
    const imageElement = document.querySelector('.sendIcon') as HTMLInputElement;
    
    setTimeout(() => {
      if (inputElement) {
        inputElement.value = text;
        inputElement.focus();
      }
      if (imageElement) imageElement.src = sendingIcon;
    }, 5);

    dispatch(selectRole(role));
    dispatch(selectLabelStyle(style));
    recordEvent("Main:Card Clicked", { "action": "Card Clicked" }, headers);
    callToAction({
      location: CTA_LOCATION_MAIN,
      ctaName: CTA_NAME_PROMPT,
      ctaType: CTA_TYPE_PROMPT,
    });
  };

  const selectedRole = useSelector((state: RootState) => state.sidebar.selectedRole || '');

  const fetchCardContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('YOUR_API_ENDPOINT/cards', {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCardContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCardContent();
  }, []);

  useEffect(() => {
    if (!cardContent || isLoading) return;

    try {
      const matchedProfileTypes = cardContent.cardContent.profileTypes
        .filter(profileType => profileType.type === "CrewMate");

      const cardsFromMatchedTypes = matchedProfileTypes
        .flatMap(profileType => profileType.cards);

      let filteredArray;

      if (selectedRole === "default") {
        const rolesToCheckString = localStorage.getItem("userRoles") || "";
        const rolesToCheck = JSON.parse(rolesToCheckString)
          .map((role: any) => role.toLowerCase() === 'creator' ? 'writer' : role.toLowerCase());

        filteredArray = cardsFromMatchedTypes.filter(item => {
          if (item && (item.role === "writer" || item.role === "chathub")) {
            return rolesToCheck.includes(item.role);
          }
          return true;
        });
      } else {
        filteredArray = cardsFromMatchedTypes
          .flatMap(item => item.role === selectedRole ? item : undefined)
          .filter(element => element !== undefined);
      }

      let shuffledCards = filteredArray.sort(() => 0.5 - Math.random());
      setRandomCards(shuffledCards.slice(0, visibleCards));
      setRenderComponent(true);
    } catch (err) {
      console.error('Error processing card data:', err);
      setError('Error processing card data');
    }
  }, [selectedRole, refreshClick, cardContent, isLoading]);

  if (isLoading && !cardContent) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      {error}
      <button onClick={fetchCardContent} className="ml-4 text-blue-500 underline">
        Retry
      </button>
    </div>;
  }

  return (
    <div>
      {renderComponent && randomCards.map((card, index) => (
        <div
          key={`${card.role}-${index}`}
          onClick={() => handleClick(card.text, card.role, card.style)}
          className="cursor-pointer"
        >
          {/* Card rendering JSX */}
        </div>
      ))}
      <button onClick={() => setRefreshClick(!refreshClick)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh Cards
      </button>
    </div>
  );
};

export default CardContent;
