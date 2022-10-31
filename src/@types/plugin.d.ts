type PluginSelection = {
  frames: FrameNode[];
  components: ComponentNode[];
};

type PluginMessage = {
  type: string;
  data: Record<string, any>;
};

type GitlabInstanceConfig = {
  host?: string;
};

type UserConfig = {
  accessToken?: string;
  gitlabInstance?: GitlabInstanceConfig;
};

interface Controller {
  handle?<T>(T): void;
  init?(): void;
}

interface CommandController extends Controller {
  handle(command: string): void;
}

interface FigmaController extends Controller {
  init(): void;
}

interface MessageController extends Controller {
  handle(message: PluginMessage): Promise<void | NotificationHandler>;
}

interface MessageService {
  updateSelection: () => void;
  updateUserConfig: () => Promise<void>;
}
