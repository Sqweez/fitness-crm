<template>
  <div>
    <t-card-page no-title>
      <div class="flex p-2 gap-2 items-center flex-column justify-start">
        <div class="flex xl:flex-col gap-y-2 gap-x-4 justify-center items-center xl:items-start w-full">
          <div class="w-48 h-48 overflow-hidden mx-auto">
            <img :src="client.photo ? client.photo : avatar" :alt="client.name" class="w-full h-full object-cover object-top">
          </div>
          <div>
            <v-list density="compact" flat>
              <t-list-item title="ФИО">
                <p class="whitespace-normal">{{ client.name }}</p>
              </t-list-item>
              <t-list-item title="Баланс">
                {{ client.balance | priceFilters }}
              </t-list-item>
              <t-list-item  title="Кто зарегистрировал">
                {{ client.registrar }}
              </t-list-item>
              <t-list-item  title="Возраст">
                {{ client.age_type }} ({{ client.age }})
              </t-list-item>
              <t-list-item  title="Телефон">
                {{ client.unmasked_phone }}
              </t-list-item>
            </v-list>
            <div class="w-full bg-yellow-300 p-3">
              <v-textarea
                rows="8"
                label="Заметка о клиенте"
                v-model="client.description"
                class="w-full"
                @keyup.enter="_updateDescription"
              ></v-textarea>
            </div>
            <v-expansion-panels v-show="!IS_BARTENDER" class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-header color="green lighten-2">
                  Дополнительно
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list>
                    <t-list-item title="Пол">
                      {{ client.gender_display }}
                    </t-list-item>
                    <t-list-item title="Телефон">
                      {{ client.phone }}
                    </t-list-item>
                    <t-list-item title="Дата рождения">
                      {{ client.birth_date_formatted }}
                    </t-list-item>
                    <t-list-item v-if="client.birth_date" title="Возраст">
                      {{ client.age }}
                    </t-list-item>
                    <t-list-item  title="Сейчас в клубе">
                      <status-icons :state="client.is_in_club" />
                    </t-list-item>
                    <t-list-item  title="Номер шкафчика" v-if="client.cabinet_number">
                      {{ client.cabinet_number }}
                    </t-list-item>
                    <t-list-item  title="Пароль для приложения">
                      {{ client.mobile_password }}
                    </t-list-item>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
        <hr class="mb-2">
        <hr class="mt-2">
        <div class="flex xl:flex-col gap-y-2 flex-wrap">
          <v-btn v-if="!client.in_bookmark" class="block w-1/2 xl:w-full" color="teal" @click="addToBookmark" dark>
            В закладку гостей
          </v-btn>
          <v-btn v-if="client.in_bookmark" class="block w-1/2 xl:w-full" color="teal" @click="removeFromBookmark" dark>
            Удалить из закладки гостей
          </v-btn>
          <div class="flex flex-col gap-y-2 flex-wrap" v-if="!IS_BARTENDER">
            <v-btn  class="block w-1/2 xl:w-full" color="light-blue" @click="openWhatsapp" dark>
              Сообщение клиенту <v-icon>mdi-whatsapp</v-icon>
            </v-btn>
            <v-btn  class="block w-1/2 xl:w-full" color="cyan" @click="$router.push(`/clients/edit/${client.id}`)" dark>
              Редактор профиля
            </v-btn>
<!--            <v-btn  class="block w-1/2 xl:w-full" color="lime" @click="$toast.success('Это еще не работает :(')" dark>
              Заявление
            </v-btn>
            <v-btn  class="block w-1/2 xl:w-full" color="deep-orange" @click="$toast.success('Это еще не работает :(')" dark>
              Договор с клиентом
            </v-btn>-->
            <v-btn  class="block w-1/2 xl:w-full" color="error" v-if="IS_BOSS" @click="_onClientDelete">
              Удалить клиента
            </v-btn>
            <v-btn  class="block w-1/2 xl:w-full" color="indigo" dark @click="onRemakeCardClick">
              Переоформить карту
            </v-btn>
          </div>
        </div>
      </div>
    </t-card-page>
    <lazy-remake-card-modal
      :state="showCardModal"
      @close="showCardModal = false"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {__hardcoded, deepClone, openInNewTab} from "@/utils/helpers";
import UserAvatar from "assets/images/logo.jpg";
import userMixin from '@/mixins/userMixin';
import {openInWhatsapp} from '@/utils/clients/clientsFunctions';

export default {
  data: () => ({
    avatar: UserAvatar,
    showCardModal: false,
  }),
  mixins: [
    userMixin
  ],
  computed: {
    ...mapGetters({
      '_client': 'clients/CLIENT',
    }),
    client () {
      return deepClone(this._client);
    }
  },
  methods: {
    ...mapActions({
      $updateClient: 'clients/updateClient',
      $removeClient: 'clients/removeClient',
      $removeBookmark: 'bookmark/removeFromBookmark',
      $createBookmark: 'bookmark/createBookmark',
    }),
    openWhatsapp () {
      return openInWhatsapp(this._client.unmasked_phone);
    /*  const phone = this._client.unmasked_phone.substring(1);
      const link = `https://api.WhatsApp.com/send?phone=${phone}`
      openInNewTab(link);*/
    },
    async _onClientDelete () {
      this.$confirm('Вы действительно хотите удалить выбранного клиента?')
        .then(async () => {
          this.$loader.enable();
          await this.$removeClient();
          await this.$router.push('/');
          this.$loader.disable();
        })
    },
    onRemakeCardClick () {
      const remakeCardPrice = __hardcoded(1000);
      if (this.client.balance < remakeCardPrice) {
        return this.$toast.error('Недостаточно средств!');
      }
      this.showCardModal = true;
    },
    async addToBookmark () {
      this.$loader.enable();
      await this.$createBookmark({
        client_id: this.client.id
      });
      this.$store.commit('clients/setClient', {
        ...this.client,
        in_bookmark: true,
      })
      this.$loader.disable();
    },
    async removeFromBookmark () {
      this.$loader.enable();
      await this.$removeBookmark(this.client.id)
      this.$store.commit('clients/setClient', {
        ...this.client,
        in_bookmark: false,
      })
      this.$loader.disable();
    },
    async _updateDescription () {
      this.$loader.enable('Идет обновление...');
      const payload = {
        id: this.client.id,
        name: this.client.name,
        //pass: this.client?.pass?.code,
        description: this.client.description,
        club_id: this.client.club.id,
        phone: this.client.phone,
      };

      if (!payload.pass) {
        delete payload.pass;
      }

      await this.$updateClient(payload);
      this.$loader.disable();
    },
  }
}
</script>

<style scoped lang="scss">

</style>
