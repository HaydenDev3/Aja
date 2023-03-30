import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Colors,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  GuildMember,
  Role,
  User,
  UserContextMenuCommandInteraction,
} from "discord.js";
import Member from "../../../database/models/Member";
import config from "../../../utils/Config";
import SlashCommand from "../../SlashCommand";

const badges = {
  ActiveDeveloper: config.emojis.unicode.activedeveloper,
  VerifiedDeveloper: config.emojis.unicode.botdeveloper,
  Partner: config.emojis.unicode.discordpartner,
  staff: config.emojis.unicode.discordstaff,
  Hypesquad: config.emojis.unicode.hypesquad,
  HypeSquadOnlineHouse2: config.emojis.unicode.HSBrilliance, /** @INFO - Brilliance HypeSquad House */
  HypeSquadOnlineHouse3: config.emojis.unicode.HSBravery, /** @INFO - Braver HypeSquad House */
  PremiumEarlySupporter: config.emojis.unicode.earlysupporter,
};

export default new (class UserContextMenuCommand implements SlashCommand {
  data: ContextMenuCommandBuilder = new ContextMenuCommandBuilder()
    .setName("User Information")
    .setType(ApplicationCommandType.User);

  invoke = async (
    client: Client,
    interaction: UserContextMenuCommandInteraction
  ) => {
    const user = interaction.targetUser;
    const member = interaction.guild?.members.cache.get(user.id) as GuildMember;

    const roleNames = member.roles?.cache
      .filter((role: Role) => role.id !== interaction.guild?.id)
      .map((role: Role) => role.name)
      .join(", ");

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.Blurple)
        .setTitle(`User Information for ${user.tag}`)
        .addFields(
          {
            name: "Username",
            value: user.username,
            inline: true,
          },
          {
            name: "Discriminator",
            value: user.discriminator,
            inline: true,
          }
        )
        .setThumbnail(user.displayAvatarURL({ forceStatic: false })),
      new EmbedBuilder()
        .setColor(Colors.Blurple)
        .setTitle(`User Information for ${user.tag} (2)`)
        .addFields({
          name: "Member Roles",
          value: roleNames || "None",
        })
        .setThumbnail(
          user.displayAvatarURL({ forceStatic: false, size: 2048 })
        ),
    ];

    if (user.bot) {
      embeds[0].data.fields?.push({
        name: "Bot",
        value: user.bot ? "🤖 Yes" : "🙂 No",
        inline: true,
      });
    }

    if (user.flags) {
      const flags = user.flags.toArray();
      const flagString = flags
        .map(
          (flag) =>
            `> ${badges[flag]} **${flag
              .replace("HypeSquadOnlineHouse2", "HypeSquad Brilliance")
              .replace("HypeSquadOnlineHouse3", "HypeSquad Bravey")
              .replace("VerifiedDeveloper", "Bot Developer")
              .replace("ActiveDeveloper", "Active Developer")}**`
        )
        .join("\n");
      embeds[0].data.fields?.push({
        name: "Badges",
        value: flagString || "None",
        inline: false,
      });
    }

    const pages = embeds.length;

    if (pages === 1) {
      await interaction.followUp({ embeds });
      return;
    }

    let currentPage = 0;

    const previousButton = new ButtonBuilder()
      .setCustomId("previous")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Previous")
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Next");

    const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      previousButton,
      nextButton
    );

    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("like_button")
        .setLabel("Like")
        .setStyle(ButtonStyle.Secondary)
    );
    const message = await interaction.followUp({
      embeds: [embeds[currentPage]],
      components: [row1, row2],
    });

    const filter = (i: any) =>
      i.customId === "previous_button" ||
      i.customId === "next_button" ||
      i.customId === "like_button";

    const collector = message.createMessageComponentCollector({
      filter,
      time: 120000,
    });

    let index: number = 0;

    collector.on("collect", async (i) => {
      const savedMember = await Member.findOne({ _id: i.user.id });
      if (!savedMember) new Member({ _id: i.user.id });

      if (i.customId === "previous_button") {
        if (index === 0) return;
        index--;
        await message.edit({
          embeds: [embeds[index]],
          components: [row1, row2],
        });
      } else if (i.customId === "next_button") {
        if (index === embeds.length - 1) return;
        index++;
        if (!embeds[index + 1]) {
          embeds.push(new EmbedBuilder().setTitle("End"));
        }
        await message.edit({
          embeds: [embeds[index]],
          components: [row1, row2],
        });
      } else if (i.customId === "like_button") {
        // Check if user already liked the target user
        const targetUser = user as User;
        const userLikes = await savedMember?.likes;
        if (userLikes?.includes(targetUser.id)) {
          await i.followUp({
            content: "You already liked this user!",
            ephemeral: true,
          });
          return;
        }

        // Update user likes in database
        userLikes?.push(targetUser.id);
        await savedMember?.save();

        await i.followUp({
          content: `You liked ${targetUser.tag}!`,
          ephemeral: true,
        });
      }
    });

    collector.on("end", async () => {
      await message.edit({ components: [] });
    });
  };
})();
